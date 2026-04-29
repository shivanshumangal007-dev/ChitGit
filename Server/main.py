from qdrant import client
from fastapi import FastAPI
from qdrant_client.models import Document, VectorParams, Distance, PointStruct
from sentence_transformers import SentenceTransformer
from upload_worker import enqueue_upload_repo
from pydanticModels import repoUrl


from controller import get_Readme, search_repos, get_Tree


app = FastAPI();
# model = SentenceTransformer("all-MiniLM-L6-v2")

# client.delete_collection(collection_name="test_collection")

# client.create_collection(
#     collection_name="repo_chunks",
#     vectors_config=VectorParams(
#         size=384,
#         distance=Distance.COSINE
#     )
# )

@app.post("/upload/repo")
def upload_repo(url: repoUrl):
    enqueue_upload_repo(url.url)
    return {"message": "Repo uploaded successfully"}


@app.get("/search/repo")
def searchRepo(query: str):
    return search_repos(query=query)



@app.get("/repo/readme")
def getReadme(repo_url: str):
    return get_Readme(repo_url=repo_url)


@app.get("/repo/tree")
def getTree(repo_url: str):
    return get_Tree(repo_url=repo_url)


# points = []

# for i, text in enumerate(texts):
#     vec = model.encode(text).tolist()
#     points.append(
#         PointStruct(
#             id=i+1,
#             vector=vec,
#             payload={"text": text}
#         )
#     )
# client.upsert(
#     collection_name="repo_chunks",
#     points=points
# )


# generate query embedding
# client.delete_collection(collection_name="repo_chunks")

# vec = model.encode("how auth works").tolist()
# result =  client.query_points(
#     collection_name="repo_chunks",
#     query=vec,
#     limit=5
# )

# print("result :" , result)