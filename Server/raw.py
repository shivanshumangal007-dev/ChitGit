from qdrant import client
from fastapi import FastAPI
from qdrant_client.models import Document, VectorParams, Distance, PointStruct
from sentence_transformers import SentenceTransformer

app = FastAPI();
model = SentenceTransformer("all-MiniLM-L6-v2")


# client.create_collection(
#     collection_name="test_collection",
#     vectors_config=VectorParams(
#         size=384,
#         distance=Distance.COSINE
#     )
# )

# texts = [
#     "JWT auth middleware validates token.",
#     "Database config uses PostgreSQL.",
#     "Routes are defined in router.py."
# ]

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
#     collection_name="test_collection",
#     points=points
# )


# generate query embedding
# client.delete_collection(collection_name="test_collection")

# vec = model.encode("how auth works").tolist()
# result =  client.query_points(
#     collection_name="test_collection",
#     query=vec,
#     limit=5
# )

# print("result :" , result)