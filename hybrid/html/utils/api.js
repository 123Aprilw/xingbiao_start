import { get } from "./request.js";
//全局TTS
export const XtfsTts = (Content , Lang , Speed ) => {
	return post('/api/v1/book/tts', {
		content: Content,
		lang: Lang,
		speed: Speed
	})
}

//绘本详情
export function getBookDetail(Code, Source) {
  return get(`/api/v2/book/detail?code=${Code}&source=${Source}`);
}
//绘本听页面
export function getBookListen(Code, Source) {
  return get(`/api/v2/book/listen?code=${Code}&source=${Source}`);
}
//绘本单词页面
export function getBookWords(Code, Source) {
  return get(`/api/v2/book/words?code=${Code}&source=${Source}`);
}
//绘本读页面
export function getBookRead(Code, Source) {
  return get(`/api/v2/book/read?code=${Code}&source=${Source}`);
}
//绘本看词识图
export function getBookWordsImg(Code, Source) {
  return get(`/api/v2/book/look_word?code=${Code}&source=${Source}`);
}
//绘本看图识词
export function getBookImgWords(Code, Source) {
  return get(`/api/v2/book/look_img?code=${Code}&source=${Source}`);
}
//绘本看词翻译
export function getBookWordsTranslate(Code, Source) {
  return get(`/api/v2/book/translate?code=${Code}&source=${Source}`);
}
//绘本中英文匹配页面
export function getBookMatch(Code, Source) {
  return get(`/api/v2/book/match?code=${Code}&source=${Source}`);
}
//绘本测验
export function getBookTest(Code, Source) {
  return get(`/api/v2/book/quiz?code=${Code}&source=${Source}`);
}
