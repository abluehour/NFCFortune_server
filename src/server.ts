import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 환경변수를 사용하기 위해 dotenv를 설정
dotenv.config();

// Express 앱 생성
const app = express();
const port = process.env.PORT || 3000; 

app.use(cors()); // CORS 설정
app.use(express.json()); // 클라이언트가 보낸 JSON 데이터를 파싱

// Gemini API 클라이언트를 설정
// .env 파일에 저장된 API 키
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// 프론트엔드에서 POST 방식으로 /api/fortune 주소로 요청을 보냄
app.post('/api/fortune', async (req: Request, res: Response) => {
  try {

    // Gemini 모델을 선택
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Gemini에게 보낼 프롬프트
    const prompt = '너는 삶의 균형을 찾아주는 라이프 코치야. 오늘 사용자에게 행운을 가져다줄 작은 행동 팁이 포함된 운세를 JSON으로 만들어줘. (예: "오늘은 하늘을 한 번 올려다보세요.") JSON 객체는 \'header\'(오늘의 운세 요약)와 \'body\'(운세 설명과 행동 팁을 포함한 2문장 이하의 내용) 키를 가져야 해. 친절하고 명확한 어조로 작성해줘. 다른 설명 없이 최종 JSON 객체만 반환해줘.';

    // Gemini API를 호출하여 텍스트를 생성
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fortuneText = response.text();

    // 생성된 운세 결과를 프론트엔드로 보냄
    res.json(JSON.parse(fortuneText));
    
  } catch (error) {
    console.error('Gemini API 호출 중 오류 발생:', error);
    res.status(500).send('운세를 생성하는 중에 문제가 발생했습니다.');
  }
});


// 서버를 시작
app.listen(port, () => {
  console.log(`백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});