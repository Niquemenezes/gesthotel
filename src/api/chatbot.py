# src/api/chatbot.py
from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()  # ← esto debe ir antes de client = OpenAI...

chatbot_api = Blueprint('chatbot_api', __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@chatbot_api.route('/chat', methods=['POST'])
def chat():
    print(" Petición recibida en /chat")
    data = request.get_json()
    print(" Mensaje recibido:", data)
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No se proporcionó mensaje"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un experto en mantenimiento hotelero. Responde de forma clara y profesional."},
                {"role": "user", "content": user_message}
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply.strip()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
