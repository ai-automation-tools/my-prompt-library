---
title: "Rag/kb Ingestion"
tags: ["collections", "ai", "ingestion", "prompt"]
category: "Collections"
subcategory: "AI"
---
# RAG/KB Ingestion Prompt

## Goal
To convert a given set of documents into a comprehensive retrieval plan for a Retrieval-Augmented Generation (RAG) system or Knowledge Base (KB).

## Inputs
- A collection of documents (e.g., text files, PDFs, HTML files).
- The domain or topic of the document collection.

## Output
A detailed retrieval plan in Markdown format, including the following sections:

### 1. Chunking Strategy
- **Chunk Size:** The optimal number of tokens or characters for each document chunk.
- **Chunk Overlap:** The number of tokens or characters that overlap between consecutive chunks.
- **Chunking Method:** The method used for chunking (e.g., fixed-size, sentence-based, paragraph-based).
- **Rationale:** A brief explanation of why this chunking strategy is suitable for the given document collection.

### 2. Metadata Schema
- **Metadata Fields:** A list of metadata fields to be extracted from each document (e.g., title, author, creation date, source URL).
- **Data Types:** The data type for each metadata field (e.g., string, integer, date).
- **Extraction Rules:** Rules for extracting each metadata field from the documents.
- **Rationale:** An explanation of how this metadata schema will be useful for retrieval.

### 3. Freshness Rules
- **Update Frequency:** How often the document collection should be checked for updates.
- **Staleness Threshold:** The maximum age of a a document before it is considered stale.
- **Update Mechanism:** The mechanism for updating the knowledge base with new or modified documents.
- **Rationale:** A justification for the chosen freshness rules.

### 4. Test Queries
- **Sample Queries:** A list of sample queries that a user might ask.
- **Expected Answers:** The expected answers to the sample queries.
- **Evaluation Metrics:** The metrics that will be used to evaluate the performance of the retrieval system (e.g., precision, recall, F1-score).
- **Rationale:** An explanation of why these test queries are representative of the user's information needs.