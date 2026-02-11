import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

def get_firebase_data():
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate("wond_prediccion.json")
            firebase_admin.initialize_app(cred)

        db = firestore.client()
        # IMPORTANTE: Verifica que tu colección se llame "preguntas"
        preguntas_ref = db.collection("preguntas").stream()
        
        preguntas_data = []
        for p in preguntas_ref:
            d = p.to_dict()
            # Usamos .get() con valor por defecto 0 para evitar errores si el campo no existe
            aciertos = d.get("aciertos", 0)
            fallos = d.get("fallos", 0)
            
            total = aciertos + fallos
            # Si nadie ha respondido la pregunta aún, ponemos dificultad neutra (0.5)
            dificultad = fallos / total if total > 0 else 0.5
            preguntas_data.append({"dificultad": dificultad})
        
        # Si la lista está vacía, creamos un DataFrame con una fila por defecto
        if not preguntas_data:
            return pd.DataFrame([{"dificultad": 0.5}])
            
        return pd.DataFrame(preguntas_data)
    except Exception as e:
        print(f"Error en Firebase: {e}")
        return pd.DataFrame([{"dificultad": 0.5}])

def obtener_dificultad_promedio():
    df_p = get_firebase_data()
    # Ahora 'dificultad' siempre existirá porque la forzamos arriba
    return float(df_p['dificultad'].mean())