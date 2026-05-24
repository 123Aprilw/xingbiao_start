import { get, post } from '@/utils/request'
//全局TTS
export const XtfsTts = (Content : string, Lang : string, Speed : string) => {
	return post('/api/v1/book/tts', {
		content: Content,
		lang: Lang,
		speed: Speed
	})
}

// 用户登录
export const login = (Mobile : string, Captcha : string) => {
	return post('/api/v1/auth/mobilelogin', {
		mobile: Mobile,
		captcha: Captcha
	})
}
//获取验证码
export const LoginCode = (Mobile : string) => {
	return post('/api/sms/send', {
		mobile: Mobile,
		event: 'mobilelogin'
	}, {
		header: {}
	})
}
//首页等级分类接口
export const HomeLever = () => {
	return get("/api/v1/index/book_cates")
}
//首页等级分类列表+搜索接口
export const BooksListSearch = (cateId : string, search : string, page : string) => {
	return get(`/api/v1/index/book_list`, {
		cate_id: cateId,
		search: search,
		page: page
	})
}
//首页获取绘本数量
export const GetBooksNums = (cateId : string, Search : string) => {
	return get(`/api/v1/index/book_count?cate_id=${cateId}&search=${Search}`)
}
//首页收藏
export const postCollect = (bookId : string, Action : string) => {
	return post("/api/v1/index/book_collect", {
		book_id: bookId,
		action: Action
	})
}
//详情页面
export const GoDetailData = (bookId : string, Source : string) => {
	return get(`/api/v1/book/detail?book_id=${bookId}&source=${Source}`)
}
//听详情
export const GetListenData = (bookId : string, Source : string) => {
	return get(`/api/v1/book/listen?book_id=${bookId}&source=${Source}`)
}
//听提交
export const PostListenData = (listenToken : string, bookId : string, listenIds : number[], Source : string) => {
	return post('/api/v1/book/listen_submit', {
		listen_token: listenToken,
		book_id: bookId,
		listen_ids: listenIds,
		source: Source
	})
}
//单词页面
export const GetWorldData = (bookId : string, Source : string) => {
	return get(`/api/v1/book/word?book_id=${bookId}&source=${Source}`)
}
//单词提交页面
export const PostWorldData = (WordToken : string, BookId : string, WorldIds : number[], Source : string) => {
	return post('/api/v1/book/word_submit', {
		word_token: WordToken,
		book_id: BookId,
		word_ids: WorldIds,
		source: Source
	})
}
//绘本读页面
export const GetReadData = (bookId : string, Source : string) => {
	return get(`/api/v1/book/read?book_id=${bookId}&source=${Source}`)
}
//绘本听提交页面
export const PostReadData = (listenToken : string, BookId : string, listenIds : number[], Source : string) => {
	return post('/api/v1/book/read_listen_submit', {
		listen_token: listenToken,
		book_id: BookId,
		listen_ids: listenIds,
		source: Source
	})
}
//绘本读提交页面
export const PostReadBookData = (bookId : string, listenId : string, audioUrl : string, Source : string) => {
	return post('/api/v1/book/read_submit', {
		book_id: bookId,
		listen_id: listenId,
		audio_url: audioUrl,
		source: Source
	})
}

// ====================
// 【独立】音频上传专用接口
// ====================
export const UploadAudio = (filePath : string) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: 'https://xingbiao.demo.zhongti-group.com/api/common/upload',
			filePath: filePath,
			name: 'file', // 接口要求的文件字段名
			header: {
				token: uni.getStorageSync('token') || ''
			},
			success: (res) => {
				try {
					const data = JSON.parse(res.data)
					if (data.code === 1) {
						resolve(data)
					} else {
						reject(new Error(data.msg || '音频上传失败'))
					}
				} catch (e) {
					reject(new Error('音频上传解析失败'))
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}
//获取看词接口
export const LookWorld = (bookId : string, Source : string) => {
	return get(`/api/v1/book/look_word?book_id=${bookId}&source=${Source}`)
}
//看词提交
export const PostLookWorld = (quizToken : string, bookId : string, errorIds : number[], Source : string) => {
	return post('/api/v1/book/look_word_submit', {
		quiz_token: quizToken,
		book_id: bookId,
		error_ids: errorIds,
		source: Source
	})
}
//获取看图接口
export const LookPicture = (bookId : string, Source : string) => {
	return get(`/api/v1/book/look_img?book_id=${bookId}&source=${Source}`)
}
//看图提交
export const PostLookPicture = (quizToken : string, bookId : string, errorIds : number[], Source : string) => {
	return post('/api/v1/book/look_img_submit', {
		quiz_token: quizToken,
		book_id: bookId,
		error_ids: errorIds,
		source: Source
	})
}
//看词翻译
export const LookWorldPoplur = (bookId : string, Source : string) => {
	return get(`/api/v1/book/translate?book_id=${bookId}&source=${Source}`)
}
//看词翻译提交
export const PostWorldPoplur = (quizToken : string, bookId : string, errorIds : number[], Source : string) => {
	return post('/api/v1/book/translate_submit', {
		quiz_token: quizToken,
		book_id: bookId,
		error_ids: errorIds,
		source: Source
	})
}
//中英文配对
export const ChineseEnglishPoplur = (bookId : string, Source : string) => {
	return get(`/api/v1/book/match?book_id=${bookId}&source=${Source}`)
}
//提交中英文配对
export const PostChineseEnglishPoplur = (quizToken : string, bookId : string, errorIds : number[], Source : string) => {
	return post('/api/v1/book/match_submit', {
		match_token: quizToken,
		book_id: bookId,
		match_ids: errorIds,
		source: Source
	})
}
//绘本测验
export const GetTestData = (bookId : string, Source : string) => {
	return get(`/api/v1/book/quiz?book_id=${bookId}&source=${Source}`)
}
//绘本测验提交
export const PostTestPoplur = (quizToken : string, bookId : string, errorIds : number[], Source : string) => {
	return post('/api/v1/book/quiz_submit', {
		quiz_token: quizToken,
		book_id: bookId,
		error_ids: errorIds,
		source: Source
	})
}
//打卡接口
export const GetCardData = () => {
	return get('/api/v1/sign/index')
}
//个人中心
//获取用户登录信息
export const LoginData = () => {
	return get("/api/v1/user/profile")
}
//获取用户学情报告
export const StudyData = (lastId : string) => {
	return get(`/api/v1/user/study_report?last_id=${lastId}`)
}
//获取用户阅读记录
export const ReadData = (lastId : number) => {
	return get(`/api/v1/user/read_record?last_id=${lastId}`)
}
//获取用户收藏记录
export const ConsifmStatus = (lastId : number) => {
	return get(`/api/v1/user/book_collect?last_id=${lastId}`)
}
//获取用户等级对照
export const ConsifmLever = () => {
	return get('/api/v1/user/level_compare')
}
//获取用户开通会员
export const GetUserVip = (cateId : string) => {
	return get(`/api/v1/member/vip_page?cate_id=${cateId}`)
}
//开通会员
export const ModelMember = (packageId : string, cateId : string) => {
	return post('/api/v1/member/apply', {
		package_id: packageId,
		cate_id: cateId
	})

}
//头像上传接口
export const PostAvatorUpload = (filePath : string) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: 'https://xingbiao.demo.zhongti-group.com/api/common/upload',
			filePath: filePath,
			name: 'file',
			header: {
				'token': uni.getStorageSync('token') || ''
			},
			success: (res) => {
				console.log(res)
				const result = JSON.parse(res.data)
				if (result.code === 1) {
					resolve(result)
				} else {
					reject(new Error(result.msg || '修改失败'))
				}
			},
			fail: (err) => {
				reject(new Error('请求失败：' + err.errMsg))
			}
		})
	})
}
//修改头像
export const PutUserAvator = (ImageUrl : string) => {
	return post('/api/v1/user/changeAvatar', {
		image: ImageUrl
	})
}
//修改昵称
export const PutUserName = (Nickname : string) => {
	return post('/api/v1/user/changeNickname', {
		nickname: Nickname
	})
}
//退出登录
export const GoOutLogin = () => {
	return post('/api/v1/user/logout')
}