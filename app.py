import streamlit as st
import google.generativeai as genai

# 1. Configuración de seguridad
try:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
except Exception as e:
    st.error("⚠️ Error con la API Key. Revisa los Secrets.")
    st.stop()

st.title("🕵️‍♂️ Modo Detective")
st.write("Vamos a ver qué modelos están disponibles para tu clave.")

if st.button("🔍 Escanear Modelos"):
    try:
        # Preguntamos a Google qué modelos tiene activos
        lista_modelos = genai.list_models()
        
        encontrados = []
        for m in lista_modelos:
            # Solo queremos los que sirven para generar texto (generateContent)
            if 'generateContent' in m.supported_generation_methods:
                encontrados.append(m.name)
        
        if encontrados:
            st.success(f"¡Conexión Exitosa! Encontré {len(encontrados)} modelos:")
            # Mostramos la lista exacta
            for modelo in encontrados:
                st.code(modelo)
            st.info("👆 Copia uno de estos nombres EXACTOS (ej: models/gemini-pro) para usar en tu app.")
        else:
            st.warning("Me conecté, pero no encontré modelos disponibles.")
            
    except Exception as e:
        st.error(f"Error grave de conexión: {e}")
