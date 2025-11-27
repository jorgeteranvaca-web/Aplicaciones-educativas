import streamlit as st
import google.generativeai as genai

# --- CONFIGURACIÓN DE LA LLAVE ---
# Aquí le decimos al código que busque la llave dentro de los "Secrets" de Streamlit
# Asegúrate de que en Streamlit > Settings > Secrets escribiste: GOOGLE_API_KEY = "tu_clave_real"
try:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
except Exception as e:
    st.error("⚠️ Error: No pude encontrar la API KEY. Asegúrate de haberla puesto en los 'Secrets' de Streamlit.")
    st.stop()

# --- INTERFAZ DE LA APP ---
st.title("Mi Super App de IA")
st.write("¡Hazme cualquier pregunta!")

usuario_input = st.text_input("Escribe aquí:")

if st.button("Enviar"):
    if usuario_input:
        try:
            # Usamos el modelo flash que es rápido y suele dar menos errores de cuota
            model = genai.GenerativeModel('gemini-1.5-flash') 
            response = model.generate_content(usuario_input)
            st.write(response.text)
        except Exception as e:
            st.error(f"Hubo un error al conectar con la IA: {e}")
    else:
        st.warning("Por favor, escribe algo antes de enviar.")
