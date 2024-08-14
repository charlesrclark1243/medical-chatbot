from typing import Union

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_pinecone import PineconeVectorStore
from langchain.prompts import PromptTemplate
from langchain.chains.retrieval_qa.base import RetrievalQA

def get_embedding_model(embedding_name: str) -> Union[HuggingFaceEmbeddings, int]:
    '''
    Gets and returns the desired embedding model from Hugging Face.

    Inputs:
        embedding_name: a string representing the name of the model on Hugging Face.
    
    Returns: the desired embedding model, if no exception; otherwise, an error code.
    '''
    
    try:
        # attempt to retrieve and return the embedding model
        embedding_model = HuggingFaceEmbeddings(model_name=embedding_name)

        return embedding_model
    except Exception:
        # if exception, notify and return error code
        print(f'Exception when getting embedding model with name "{embedding_name}".')

        return 1

def get_llm(llm_name: str, temp: float, num_gpu: int) -> Union[OllamaLLM, int]:
    '''
    Gets and returns the desired Ollama LLM.

    Inputs:
        llm_name: the name of the Ollama LLM to be used.
        temp: the temperature to be used by the LLM.
        num_gpu: the number of GPUs to be used by the LLM.

    Returns: the desired Ollama LLM, if no exception; otherwise, an error code.
    '''

    try:
        # make sure input temperature and number of GPUs are valid; if not, notify and return error code
        if (temp < 0.0) or (temp > 2.0):
            print(f'Temperature must be between 0 and 2 (got {temp}).')

            return 2
        elif (num_gpu < 0):
            print(f'Number of GPUs must be non-negative (got {num_gpu}).')

            return 3

        # attempt to retrieve and return LLM
        llm = OllamaLLM(model=llm_name, temperature=temp, num_gpu=num_gpu)

        return llm
    except Exception:
        # if exception, notify and return error code
        print(f'Exception when getting LLM with name "{llm_name}", temperature {temp}, and number of GPUs {num_gpu}.')

        return 4
    
def get_pc_vector_store(index_name: str, embedding_model: HuggingFaceEmbeddings) -> Union[PineconeVectorStore, int]:
    '''
    Gets and returns a PineconeVectorStore using the provided name and embedding model.

    Inputs:
        index_name: the name of the Pinecone index to be used.
        embedding_model: the embedding model to be used.

    Returns: a PineconeVectorStore of the desired index, if no exception; otherwise, an error code.
    '''

    try:
        # attempt to get and return a PineconeVectorStore of the passed index name
        pc_vector_store = PineconeVectorStore(index_name=index_name, embedding=embedding_model)

        return pc_vector_store
    except Exception:
        # if exception, notify and return error code
        print(f'Exception when getting PineconeVectorStore with name "{index_name}".')

        return 5
    
def get_prompt_template() -> Union[PromptTemplate, int]:
    '''
    Creates and returns the PromptTemplate to be used by the chain.

    Inputs: None.

    Returns: a PromptTemplate, if no exception; otherwise, an error code.
    '''

    template = '''
    Please use the following information to answer the user's question.
    If you don't know the answer, do NOT try to make one up; just say you don't know.

    If the user thanks you, give a typical response.

    Context: {context}
    Question: {question}

    Only return a helpful answer and nothing else below:
    '''

    try:
        # attempt to create and return PromptTemplate using the defined template string
        prompt = PromptTemplate(template=template, input_variables=['context', 'question'])

        return prompt
    except Exception:
        # if exception, notify and return error code
        print(f'Exception when creating PromptTemplate.')

        return 6

def get_chain(llm: OllamaLLM, pc_vector_store: PineconeVectorStore, prompt: PromptTemplate) -> Union[RetrievalQA, int]:
    '''
    Gets a returns a chain using the passed OllamaLLM, PineconeVectorStore, and PromptTemplate objects.

    Inputs:
        llm: the OllamaLLM to be used.
        pc_vector_store: the PineconeVectorStore to be used in retireval.
        prompt: the PromptTemplate to be used.

    Returns: a RetrievalQA chain, if no exception; otherwise, an error code.
    '''

    try:
        # attempt to create and return a RetrievalQA chain
        chain_kwargs = {'prompt': prompt}
        qa = RetrievalQA.from_chain_type(llm=llm, retriever=pc_vector_store.as_retriever(), return_source_documents=True, chain_type_kwargs=chain_kwargs)

        return qa
    except Exception:
        # if exception, notify and return error code
        print(f'Exception when creating chain using passed OllamaLLM, PineconeVectorStore, and PromptTemplate.')

        return 7
    
def query_chain(chain: RetrievalQA, question: str) -> Union[str, int]:
    '''
    Passes a query to the chain and returns the response.

    Inputs:
        chain: the chain to be queried.
        question: the question to be asked of the chain.

    Returns: the chain's string response, if no exception; otherwise, an error code.
    '''

    try:
        # attemp to query the chain and return a response
        result = chain({'query': question})

        return result['result']
    except Exception:
        # if exception, notify and return error code
        print(f'Exception when querying chain with question "{question}".')

        return 8
    