// src/services/aiService.js

const DEEPSEEK_API_KEY = "sk-c76f7a44fd974f04ad7593aa6777f170"; // Pega aquí tu llave

export const generateQuizData = async () => {
  // Definimos una lista de temas para que la IA elija aleatoriamente o mezcle
  const temas = ["Arquitectura", "Derecho", "Administración de Empresas", "Psicologia", "Informatica", "Negocios Internacionales", "Marketing"];
  
  const prompt = `Genera un JSON con 10 preguntas de trivia académica sobre las carreras de la universidad UIDE Sede Loja:
  1. TEMAS: Las preguntas deben ser conceptos básicos de: ${temas.join(", ")}. No repitas el mismo tema más de dos veces.
  2. DIFICULTAD: Deben ir de nivel introductorio (1er semestre)
  3. PREMIOS: [100, 500, 1000, 5000, 10000, 20000, 50000, 100000, 500000, 1000000].
  4. FORMATO: Devuelve SOLO el objeto JSON con esta estructura:
  {
    "questions": [
      {
        "question": "¿Pregunta sobre [Tema]?",
        "options": ["A", "B", "C", "D"],
        "correct": 0,
        "prize": 100,
        "category": "Nombre de la carrera"
      }
    ]
  }`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un generador de trivias multitemáticas. No repitas preguntas de sesiones anteriores." },
          { role: "user", content: prompt + `\nSemilla aleatoria: ${Math.random()}` } // La semilla ayuda a que no devuelva lo mismo
        ],
        temperature: 0.9, // Subimos la temperatura para más creatividad y variedad
        response_format: { type: 'json_object' }
      })
    });

    const result = await response.json();
    return result.choices[0].message.content; // Retorna el string JSON
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    return null;
  }
};