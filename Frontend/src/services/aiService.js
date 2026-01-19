const DEEPSEEK_API_KEY = "sk-c76f7a44fd974f04ad7593aa6777f170"; 

export const generateQuizData = async (preguntasExistentes = []) => {
  const temas = [
    "Informática Básica (Hardware/Software)",
    "Programación (Lógicas y lenguajes)",
    "Desarrollo de Software",
    "Bases de Datos (SQL/NoSQL)",
    "Redes de Computadoras",
    "Seguridad Informática",
    "Sistemas Operativos (Linux/Windows)",
    "Computación en la Nube",
    "Ingeniería de Software",
    "Inteligencia Artificial",
    "Ciencia de Datos"
    ];
  
  // Lista negra para el prompt
  const listaNegra = preguntasExistentes.length > 0 
    ? `EVITA estas preguntas: ${preguntasExistentes.slice(-10).join(", ")}` 
    : "";

  const prompt = `Genera un JSON con 20 preguntas nuevas de TI. 
  ${listaNegra}
  Formato JSON: {"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "correct": 0, "prize": 100, "category": "..."}]}`;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un generador de JSON. No escribas texto antes ni después del JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" } // Esto fuerza a la IA a responder JSON
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error en la API");
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // Intentamos parsear. Si falla, devolvemos un objeto vacío seguro.
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("La IA no devolvió JSON válido:", content);
      return { questions: [] };
    }
  } catch (error) {
    console.error("Error en generateQuizData:", error);
    throw error; // Re-lanzamos para que App.jsx lo capture
  }
};