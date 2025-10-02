// 1. 필요한 라이브러리들을 불러옵니다.
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 2. 환경변수를 사용하기 위해 dotenv를 설정합니다.
dotenv.config();

// 3. Express 앱을 생성하고 기본 설정을 합니다.
const app = express();
const port = process.env.PORT || 3000; // 서버는 3000번 포트에서 실행됩니다.

app.use(cors()); // CORS 설정: 모든 출처의 요청을 허용합니다. (개발 편의를 위해)
app.use(express.json()); // 클라이언트가 보낸 JSON 데이터를 파싱하기 위한 설정입니다.

// 4. Gemini API 클라이언트를 설정합니다.
// .env 파일에 저장된 API 키를 가져옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// 5. 운세를 봐주는 API 엔드포인트를 만듭니다.
// 프론트엔드에서 POST 방식으로 /api/fortune 주소로 요청을 보낼 겁니다.
app.post('/api/fortune', async (req: Request, res: Response) => {
  try {
    // 프론트에서 보낸 주제(topic)를 받습니다. (예: "오늘의 연애운")
    

    // Gemini 모델을 선택합니다.
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Gemini에게 보낼 프롬프트를 만듭니다.
    const prompt = `오늘의 운세를 간략하게 설명해줘 간단한 제목과 함께 2문장 이하로`;

    // Gemini API를 호출하여 텍스트를 생성합니다.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fortuneText = response.text();

    // 생성된 운세 결과를 프론트엔드로 보냅니다.
    res.json({ fortune: fortuneText });
    
  } catch (error) {
    console.error('Gemini API 호출 중 오류 발생:', error);
    res.status(500).send('운세를 생성하는 중에 문제가 발생했습니다.');
  }
});


// 6. 서버를 시작합니다.
app.listen(port, () => {
  console.log(`백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});