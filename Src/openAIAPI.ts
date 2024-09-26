declare const OPEN_AI_API_KEY: string; //loaded in from Assets folder; hidden from git
let GPT_MODEL = "gpt-4o";

const GetChatGPTReply = (prompt: string, context?: string): Promise<string> => {
    const messages: { role: string, content: string }[] = [];
    if (context) {
        messages.push({
            "role": "system",
            "content": context
        })
    }

    messages.push({
        "role": "user",
        "content": prompt
    })

    //console.log(prompt);
    return new Promise((resolve) => {
        var url = "https://api.openai.com/v1/chat/completions";
        var bearer = 'Bearer ' + OPEN_AI_API_KEY
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": GPT_MODEL,
                "messages": messages,
                "temperature": 0.8,
                "top_p": 0.99
            })
        }).then(response => {
            response.json().then((data) => {
                const content = data["choices"][0]["message"]["content"]
                resolve(content);
            })
        });
    })
}