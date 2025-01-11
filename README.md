# **Conceptmap.AI**

![{6C614F01-A4F4-43D0-B382-E0E0C0E004C8}](https://github.com/user-attachments/assets/faea3681-534e-4a6a-be01-ac1db8c28930)

**Conceptmap.AI** is an AI-driven concept map creator designed to simplify and deepen your understanding of any topic. It generates nodes with content powered by an LLM, connected through edges to visually represent relationships. The tool provides multiple perspectives, guiding learners from basic concepts to advanced insights. Perfect for students, educators, and professionals, it transforms complex topics into clear, interactive maps.

## Features

* Generating data with LLM
* Fetch YouTube Videos related to the topics/subjects
* Generates Blogs, Essays and summaries
* Helps to provide valuable insights regarding the subject

## Tech Stack

* [Next.js](https://nextjs.org)
* [React Flow](https://reactflow.dev/)
* [PostgreSQL](https://postgres.org)
* [X AI](https://console.x.ai/)
* [Prisma](https://www.prisma.io/)
* [Recoil](https://recoiljs.org)
* [Authjs](https://authjs.dev/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vishvsalvi/conceptmap.ai.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY
   GOOGLE_GENERATIVE_AI_API_KEY
   DATABASE_URL
   AUTH_SECRET
   AUTH_GOOGLE_SECRET
   AUTH_GOOGLE_ID
   AUTH_GITHUB_SECRET
   AUTH_GITHUB_ID
   ```

4. Run database migration:
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
