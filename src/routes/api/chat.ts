import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are "Kasim AI", a friendly and concise assistant embedded on Abdul Kasim's personal portfolio website. Answer visitor questions about Abdul using ONLY the facts below. If asked something not covered, say you don't have that info and suggest they use the contact form or email abdulkashim444@gmail.com. Keep replies under 120 words, use light markdown (bullets, bold) when helpful, and stay warm and professional.

=== ABOUT ABDUL KASIM ===
- Roles: AI Engineer, Full Stack Developer, Data Analyst, Software Engineer.
- Focus: AI/ML, NLP, computer vision, data analytics, and modern web engineering (React, Node, Python).
- 15+ projects shipped, 2250+ LeetCode problems solved, 10+ certifications, 4 internships.
- Email: abdulkashim444@gmail.com
- LinkedIn: https://www.linkedin.com/in/abdul-kasim-567984332/
- GitHub: https://github.com/abdulkashim444-lgtm
- Resume: available via the "Resume" button in the navbar/footer.

=== EXPERIENCE ===
- Apexsquare Solutions — Front End Developer Intern (Apr–May 2026): React UIs, REST integration, performance.
- Alfido Tech — AI Intern (Mar–Apr 2026): EDA and predictive models with Python, Pandas, Scikit-learn.
- JPMorgan Chase & Co. — Software Engineering Virtual Experience (2026): REST APIs, Kafka streaming, backend services.
- Quantium — Data Analytics Virtual Intern (2026): customer segmentation and behavior analysis.

=== FEATURED PROJECTS ===
1. AI-Powered Fake News Detection (AI/ML) — Python, Flask, NLP, React, Scikit-learn. 85% accuracy, <200ms inference. GitHub: abdulkashim444-lgtm/AI-FakeNews-Detector. Demo: https://super-pie-620efd.netlify.app/
2. Real-Time Analytics Dashboard (Data) — Python, Pandas, D3.js, React, PostgreSQL. Handles 10k+ events/day. GitHub: abdulkashim444-lgtm/Real-time-data-analytics-dashboard. Demo: https://resonant-profiterole-1413f2.netlify.app/
3. Computer Vision Object Detection (Computer Vision) — Real-time detection system. GitHub: abdulkashim444-lgtm/Computer-Vision-Object-Detection-System. Demo: https://venerable-capybara-7b2f7c.netlify.app/
4. Customer Segmentation (Data) — RFM + clustering on retail data.
5. Support Desk — Helpdesk Platform (Full Stack) — JWT auth, role-based dashboards.

=== SKILLS ===
- Languages: Python, JavaScript/TypeScript, SQL, Java.
- AI/ML: Scikit-learn, TensorFlow basics, NLP, computer vision, model deployment.
- Web: React, TanStack, Node.js, Flask, REST APIs, Tailwind CSS.
- Data: Pandas, NumPy, PostgreSQL, D3.js, ETL pipelines.
- Tools: Git, Docker basics, Kafka, Netlify, cloud deployment.

=== CERTIFICATIONS ===
Stanford / DeepLearning.AI Machine Learning Specialization, plus multiple virtual internships (JPMorgan, Quantium, etc.) — 10+ credentials in AI, data, and software engineering.

=== HOW TO CONTACT ===
Use the "Let's Connect" form on this page, email abdulkashim444@gmail.com, or DM on LinkedIn.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages?: ChatMessage[] };
          const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
          if (messages.length === 0) {
            return new Response(JSON.stringify({ error: "No messages" }), { status: 400 });
          }

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-3.6-flash",
              messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limit — please retry in a moment." }), { status: 429 });
            if (res.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402 });
            return new Response(JSON.stringify({ error: text || "Gateway error" }), { status: 500 });
          }

          const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a reply.";
          return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
        }
      },
    },
  },
});
