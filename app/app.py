# import necessary modules
from flask import Flask, request
from flask_cors import CORS
import os, sys

import utils

# set up Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

CORS(app, resources=r'/*')

# define error-checking function
def check(input) -> None:
    '''
    Given the input, checks if it's an error code or not; if it is, terminates the process.

    Inputs:
        input: the object to be used in checking the program's status.
    '''
    
    # if input is an error code, terminate with said error code
    if isinstance(input, int):
        sys.exit(input)

# initialize global variables
embedding_model = utils.get_embedding_model('sentence-transformers/all-MiniLM-L6-v2')
check(embedding_model)

llm = utils.get_llm('llama3.1:8b', temp=0.8, num_gpu=1)
check(llm)

INDEX_NAME = 'medical-chatbot'
pc_vector_store = utils.get_pc_vector_store(INDEX_NAME, embedding_model)
check(pc_vector_store)

prompt = utils.get_prompt_template()
check(prompt)

qa = utils.get_chain(llm, pc_vector_store, prompt)
check(qa)

# define API routes
@app.route('/', methods=['GET'])
def root():
    '''
    Root sanity check route.

    Inputs: None.

    Returns: "Hello, world!".
    '''

    return {
        'response': 'Hello, world!'
    }

@app.route('/sanity', methods=['GET'])
def sanity():
    '''
    A sanity check for the LLM backend.

    Inputs: None.

    Returns: a response to the hard-coded question asked.
    '''
    question = 'What is the cause of heart attack?'
    response = utils.query_chain(qa, question=question)

    if isinstance(response, int):
        response = f'Sorry, I ran into an issue when processing your previous question (error code {response}), feel free to try again. If the issue persists, I recommend trying to contact your healthcare provider with your question instead.'
    
    return {
        'question': question,
        'response': response
    }

@app.route('/query', methods=['POST'])
def query():
    '''
    Queries the global chain with the question asked on the front end and returns a response.

    Inputs: None.

    Returns: a response to the question asked on the front end.
    '''

    if request.method == 'POST':
        question = request.form['question']
        response = utils.query_chain(qa, question=question)

        if isinstance(response, int):
            response = f'Sorry, I ran into an issue when processing your previous question (error code {response}), feel free to try again. If the issue persists, I recommend trying to contact your healthcare provider with your question instead.'
        
        return {
            'response': response
        }
    
# run app
if __name__ == '__main__':
    app.secret_key = os.getenv('SECRET_KEY')
    app.run(debug=True)
