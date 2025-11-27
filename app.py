import streamlit as st
import google.generativeai as genai

# --- CONFIGURACIÓN ---
try:
    # Conectamos con la llave secreta
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
except Exception as e:
    st.error("⚠️ Error: No encontré la API KEY en los Secrets.")
    st.stop()

# --- DISEÑO DE LA PÁGINA ---
st.set_page_config(page_title="Saga Números Eternos", page_icon="➗")

st.title("La Saga de los Números Eternos ♾️")
st.write("Bienvenido, viajero. Haz tu consulta matemática o sobre la historia:")

# --- CHAT ---
# Usamos un cuadro de texto para la pregunta
usuario_input = st.text_input("Tu pregunta:", placeholder="Ej: ¿Cómo resuelvo este acertijo?")

if st.button("Invocar Sabiduría"):
    if usuario_input:
        try:
            # USAMOS EL MODELO QUE ENCONTRAMOS EN TU LISTA (Gemini 2.5 Flash)
            model = genai.GenerativeModel('models/gemini-2.5-flash')
            
            with st.spinner('Consultando a los oráculos...'):
                response = model.generate_content(usuario_input)
                st.success("Respuesta:")
                st.write(response.text)
                
        except Exception as e:
            st.error(f"Hubo un error técnico: {e}")
    else:
        st.warning("Por favor, escribe algo antes de invocar.")

# --- PIE DE PÁGINA ---
st.markdown("---")
st.caption("Desarrollado para la clase de Matemáticas")
