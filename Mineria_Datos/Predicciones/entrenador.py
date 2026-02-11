import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
from datetime import datetime, timedelta

# Configuración
UMBRAL_EXITO = 500000 # Un puntaje >= a esto se considera "Completado"

def generar_y_entrenar():
    print("1. Generando 5000 datos sintéticos...")
    nombres_base = ["CHOCHO", "DIEGO", "DANIELA", "VALERIA", "SEBAS", "CARO", "MAGALY", "EDWIN", "EVELYN"]
    data = []
    fecha_base = datetime(2026, 1, 1)
    
    for _ in range(5000):
        nombre = np.random.choice(nombres_base)
        # Generamos puntajes aleatorios basados en tu reporte original
        puntaje = np.random.choice([1000000, 500000, 250000, 100000, 50000, 1000])
        puntaje = int(puntaje * np.random.uniform(0.7, 1.3))
        fecha = fecha_base + timedelta(days=np.random.randint(0, 60))
        data.append([nombre, puntaje, fecha.strftime("%m/%d/%Y, %I:%M:%S %p")])
    
    df = pd.DataFrame(data, columns=["Nombre", "Puntaje", "Fecha"])
    df['Nombre'] = df['Nombre'].str.upper().str.strip()
    
    # Guardar el CSV para que no de error de "archivo no encontrado"
    df.to_csv("datos_sinteticos_rendimiento.csv", index=False)
    print("   -> Archivo 'datos_sinteticos_rendimiento.csv' creado.")

    print("2. Procesando datos para el modelo...")
    # Mapeo de nombres a números
    mapping = {nombre: i for i, nombre in enumerate(df['Nombre'].unique())}
    df['Nombre_ID'] = df['Nombre'].map(mapping)
    df['Fecha_DT'] = pd.to_datetime(df['Fecha']).view(np.int64) // 10**9
    
    # Definimos la etiqueta de éxito (0 o 1)
    df['Completo'] = (df['Puntaje'] >= UMBRAL_EXITO).astype(int)
    
    X = df[['Nombre_ID', 'Fecha_DT']]
    y = df['Completo']
    
    print("3. Entrenando modelo de Inteligencia Artificial...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Guardar el modelo y el mapeo
    joblib.dump(model, 'modelo_probabilidad.pkl')
    joblib.dump(mapping, 'mapping_nombres.pkl')
    
    print("\n¡PROCESO COMPLETADO!")
    print("Archivos generados: 'modelo_probabilidad.pkl' y 'mapping_nombres.pkl'")
    print("Ahora ya puedes ejecutar: streamlit run app.py")

if __name__ == "__main__":
    generar_y_entrenar()