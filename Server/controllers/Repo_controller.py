import time
from github import Github
from github import Auth
from controllers.code_controller import get_file_code, create_chunk
from config.config import GITHUB_TOKEN
import os

auth = Auth.Token(GITHUB_TOKEN)


g = Github(auth=auth)


IGNORE_DIRS = {
    ".git",
    ".github",
    ".vscode",
    "node_modules",
    "venv",
    "__pycache__",
    ".idea",
    "dist",
    "build",
    ".next"
}

IGNORE_FILES = {
    ".DS_Store",
    ".gitignore",
    ".env",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock"
}

IGNORE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".pdf",
    ".zip",
    ".exe"
}


def search_repos(query):
    try:
        repos = g.search_repositories(query=query)
        normalized_repos = []
        for repo in repos:
            normalized_repos.append({
                "name": repo.name,
                "full_name": repo.full_name,
                "url": repo.html_url,
                "stars": repo.stargazers_count,
                "description": repo.description
            })  
        return normalized_repos
    except Exception as e:
        print(f"Error occurred while searching repositories: {e}")
        return []



def get_Readme(repo_url):
    try:
        repo_name = repo_url.split("github.com/")[1]
        # print(f"Fetching README for repo: {repo_name}") #debugging log
        repo = g.get_repo(repo_name)
        readme = repo.get_readme()
        return {"readme": readme.decoded_content.decode("utf-8")}
    except Exception as e:
        print(f"Error occurred while fetching README: {e}")
        return {"error": str(e)}


def get_Tree(repo_url):
    try:
        repo_name = repo_url.split("github.com/")[1]
        # print(f"Fetching file tree for repo: {repo_name}") #debugging log
        repo = g.get_repo(repo_name)
        contents = repo.get_contents("")
        file_tree = []
        total_usable_files = 0
        while contents:
            file_content = contents.pop(0)
            
            print(f"Processing file: {file_content}") #debugging log
            path_parts = file_content.path.split("/")
            filename = os.path.basename(file_content.path)

            # Ignore directories anywhere in path
            if any(part in IGNORE_DIRS for part in path_parts):
                continue

            # Ignore specific files
            if filename in IGNORE_FILES:
                continue

            # Ignore file extensions
            if any(filename.endswith(ext) for ext in IGNORE_EXTENSIONS):
                continue
            if file_content.type == "file":
                code = get_file_code(repo,file_content.path)
            else:
                code = None
            file_tree.append({
                "code": code,
                "path": file_content.path,
                "type": file_content.type,
                "size": file_content.size,
            })

            if file_content.type == "dir":
                contents.extend(repo.get_contents(file_content.path))
            total_usable_files+=1

        c = []

        for file_info in file_tree:
            print(f"Creating chunks for file: {file_info['path']} with size: {file_info['size']} bytes") #debugging log
            chunks = create_chunk(file_info)
            c.append({
                "path": file_info['path'],
                "chunks": chunks
            })
            print(f"Created {len(chunks)} chunks for file: {file_info['path']}") #debugging log

        
        return {"file_tree": file_tree, "total_usable_files": total_usable_files, "chunks": c[:200]}
    except Exception as e:
        print(f"Error occurred while fetching file tree: {e}")
        return {"error": str(e)}




def upload_repo(url):
    print(f"Starting upload for repo at {url}")
    time.sleep(20)
    print(f"Upload completed for repo at {url}")
    
    return {"message": f"Repo at {url} uploaded successfully"}