import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

chatbot_api = Blueprint('chatbot_api', __name__)

@chatbot_api.route('/chat', methods=['POST'])  
def chat():
    from openai import OpenAI
    load_dotenv()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ No se encontró OPENAI_API_KEY.")
        return jsonify({"error": "Clave API no encontrada"}), 500

    client = OpenAI(api_key=api_key)

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

        print("🟡 Pregunta recibida:", user_message)
        print("🟢 Mantenito responde:", reply)

        return jsonify({"reply": reply.strip()}), 200

    except Exception as e:
        print("❌ Error con OpenAI:", repr(e))
        return jsonify({"error": str(e)}), 500
