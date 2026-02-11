import streamlit as st
import pandas as pd
import joblib
import numpy as np
from firebase_connector import obtener_dificultad_promedio

# Configuración de página
st.set_page_config(page_title="Predicción IA & Firebase", page_icon="🎯", layout="wide")

st.title("🎯 Sistema de Predicción de Rendimiento")
st.markdown("""
Esta aplicación combina **Inteligencia Artificial** con datos en tiempo real de **Firebase** para predecir la probabilidad de que un jugador complete el reto.
""")

# 1. CARGA DE MODELOS
@st.cache_resource
def cargar_recursos():
    try:
        model = joblib.load('modelo_probabilidad.pkl')
        mapping = joblib.load('mapping_nombres.pkl')
        return model, mapping
    except:
        return None, None

model, mapping = cargar_recursos()

if model is None:
    st.error("⚠️ No se encontró el modelo. Por favor, ejecuta 'python entrenador.py' primero.")
    st.stop()

# 2. CARGA DE ARCHIVO
uploaded_file = st.file_uploader("Sube tu reporte de jugadores (CSV)", type=["csv"])

if uploaded_file:
    try:
        # Lectura flexible del CSV (manejo de formatos con comillas dobles)
        df = pd.read_csv(uploaded_file)
        if len(df.columns) <= 1:
            df = pd.read_csv(uploaded_file, quotechar='"', skipinitialspace=True)
        
        st.subheader("📋 Datos detectados")
        st.dataframe(df.head(5), use_container_width=True)

        if st.button("🚀 Calcular Predicciones con IA + Firebase"):
            with st.spinner('Consultando dificultad en Firebase y procesando IA...'):
                
                # A. Obtener dificultad desde Firebase
                dif_firebase = obtener_dificultad_promedio()
                
                # B. Preprocesamiento de los datos del CSV
                # Normalizamos nombres y fechas
                df['Nombre_Limpio'] = df['Nombre'].astype(str).str.upper().str.strip()
                df['Nombre_ID'] = df['Nombre_Limpio'].map(mapping).fillna(0)
                
                # Convertimos fecha a formato numérico para el modelo
                try:
                    df['Fecha_DT'] = pd.to_datetime(df['Fecha']).view(np.int64) // 10**9
                except Exception as e:
                    st.error(f"Error en el formato de fecha: {e}")
                    st.stop()

                # C. Predicción base con el modelo Random Forest
                X_input = df[['Nombre_ID', 'Fecha_DT']]
                prob_base = model.predict_proba(X_input)[:, 1]

                # D. Ajuste de probabilidad según dificultad de Firebase
                # Si dificultad es 0.5 (neutra), multiplicador es 1.0 (no cambia)
                # Si dificultad es 1.0 (máxima), multiplicador es 0.5 (baja la chance)
                multiplicador = 1.5 - dif_firebase
                prob_final = (prob_base * multiplicador).clip(0, 1)

                # E. Creación de columnas de resultados
                df['Prob_Num'] = prob_final * 100
                df['Chance de Éxito'] = df['Prob_Num'].apply(lambda x: f"{x:.2f} %")

                # F. Visualización de Resultados
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Dificultad de Preguntas (Firebase)", f"{dif_firebase:.2%}")
                with col2:
                    mejor_jugador = df.loc[df['Prob_Num'].idxmax(), 'Nombre']
                    st.metric("Jugador con más Chance", mejor_jugador)

                st.subheader("🏆 Ranking de Probabilidades")
                # Ordenar por el valor numérico para que el ranking sea real
                res_final = df[['Nombre', 'Puntaje', 'Chance de Éxito', 'Prob_Num']].sort_values(by='Prob_Num', ascending=False)
                
                # Mostrar tabla final limpia
                st.dataframe(res_final[['Nombre', 'Puntaje', 'Chance de Éxito']], use_container_width=True)

                # G. Botón de descarga
                csv = res_final[['Nombre', 'Puntaje', 'Chance de Éxito']].to_csv(index=False).encode('utf-8')
                st.download_button("📥 Descargar Reporte de Predicciones", csv, "predicciones_ia.csv", "text/csv")

    except Exception as e:
        st.error(f"Se produjo un error al procesar el archivo: {e}")

else:
    st.info("💡 Por favor, sube un archivo CSV para comenzar el análisis.")