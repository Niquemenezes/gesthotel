from flask import Blueprint, request, jsonify
from openai import OpenAI
import os

chatbot_api = Blueprint('chatbot_api', __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@chatbot_api.route('/api/chat', methods=['POST'])
def chat():
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

        # Aseguramos que siempre devolvemos JSON válido
        return jsonify({"reply": reply.strip()}), 200

    except Exception as e:
        # Incluso en errores, devolvemos JSON bien formateado
        return jsonify({"error": str(e)}), 500
