
# ==============================
# IMPORTING LIBRARIES
# ==============================
from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv
import os
import traceback

# ==============================
# LOAD ENV VARIABLES
# ==============================
load_dotenv()

# ==============================
# INITIALIZING FLASK APP & GEMINI CLIENT
# ==============================
app = Flask(__name__)

# The new SDK automatically looks for the GEMINI_API_KEY environment variable!
try:
    client = genai.Client()
except Exception as e:
    print("!!! CLIENT INITIALIZATION ERROR !!!")
    print(str(e))

# ==============================
# HOME ROUTE
# ==============================
@app.route("/")
def home():
    return render_template("index.html")

# ==============================
# ANALYZE ROUTE
# ==============================
@app.route("/analyze", methods=["POST"])
def analyze_lyrics():
    try:
        # get json data from frontend
        data = request.get_json()

        # extract lyrics text
        lyrics = data.get("lyrics")
        mode = data.get("mode")
        # validation
        if not lyrics:
            return jsonify({"error": "No lyrics provided"}), 400

        # ==============================
        # PROMPT FOR GEMINI
        # ==============================

        if mode == "mood":

            prompt = f"""
            Analyze the emotional mood of these lyrics.

            Mention:
            - emotional intensity
            - dominant feelings
            - emotional transitions

            Lyrics:
            {lyrics}
            """

        elif mode == "theme":

            prompt = f"""
            Analyze the themes of these lyrics.

            Mention:
            - central themes
            - hidden meanings
            - storytelling elements

            Lyrics:
            {lyrics}
            """

        elif mode == "writing":

            prompt = f"""
            Give songwriting feedback for these lyrics.

            Mention:
            - vocabulary quality
            - rhyme quality
            - creativity
            - strengths
            - improvements

            Lyrics:
            {lyrics}
            """

        else:

            prompt = f"""
            Analyze these lyrics completely.

            Mention:
            - mood
            - themes
            - emotional tone
            - writing quality
            - summary

            Lyrics:
            {lyrics}
            """

        # ==============================
        # GENERATE CONTENT USING MODERN SDK
        # ==============================
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        analysis = response.text

        # ==============================
        # SEND RESPONSE BACK
        # ==============================
        return jsonify({
            "analysis": analysis
        })

    except Exception as e:
        # CRITICAL: This will print the exact line number and cause of the crash in your terminal
        print("\n=== !!! DETAILED BACKEND CRASH ERROR !!! ===")
        traceback.print_exc()
        print("============================================\n")
        
        return jsonify({
            "error": str(e)
        }), 500

# ==============================
# RUN FLASK APP
# ==============================
if __name__ == "__main__":
    app.run(debug=True)