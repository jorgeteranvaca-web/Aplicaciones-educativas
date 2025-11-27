import streamlit as st
import google.generativeai as genai

# Configuración (Oculta tu API Key en los 'secrets' de Streamlit, no en el código público)
genai.configure(api_key="TU_API_KEY_AQUI")

# Diseño de la App
st.title("Mi Super App de IA")
usuario_input = st.text_input("Escribe tu pregunta aquí:")

if st.button("Enviar"):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(usuario_input)
    st.write(response.text)
