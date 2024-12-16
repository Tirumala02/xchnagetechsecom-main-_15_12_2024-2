import os
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

# Load environment variables from .env file
load_dotenv()
gemini_api_key = os.getenv("GOOGLE_API_KEY")

# Function to extract HSN code using regex
# def extract_hsn_code(response_text):
#     match = re.search(r"\b\d{4}(?:\.\d{2})?(?:\.\d{2})?\b", response_text)  # Matches HSN code (4-8 digits)
#     return match.group(0) if match else "not_found"


def extract_hsn_code(response_text):
    # Use a regular expression to find sequences of digits with optional decimal points
    match = re.search(r'\b\d+(\.\d+)*\b', response_text)
    
    if match:
        # Extract the matched sequence
        hsn_code = match.group(0)
        
        # Check if the code contains at least 4 digits
        if len(hsn_code.replace('.', '')) >= 4:
            return hsn_code

    return "not_found"  # Return "not_found" if no valid HSN code is found


# Function to get response from Gemini API using the query
def get_query_chain(query):
    prompt_template = """
    Respond to the query with the relevant details, including the HSN code if applicable.
    Query: {query}
    Response:
    """
    try:
        # Ensure API key is passed to the model
        if not gemini_api_key:
            raise ValueError("GOOGLE_API_KEY not set. Check your .env file or environment variables.")
        
        # Create model instance and prepare the prompt
        model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.1, api_key=gemini_api_key)
        prompt = PromptTemplate(template=prompt_template, input_variables=["query"])
        prompt_input = prompt.format_prompt(query=query).to_string()

        # Get the response from the model
        response = model.predict(prompt_input)
        return response

    except Exception as e:
        print(f"Error: {e}")
        return {"error": "An error occurred while processing your request."}

# Main function to accept query from terminal
def main():
    query = input("Enter your query: ")
    
    if not query:
        print("Query is empty. Please provide a valid query.")
        return
    
    # Get response from Gemini API
    response = get_query_chain(query)
    
    if "error" in response:
        print("Error occurred:", response["error"])
    else:
        hsn_code = extract_hsn_code(response)
        print(f"Extracted HSN Code: {hsn_code}")

if __name__ == "__main__":
    main()
