import { ref } from 'vue'
interface UserTs {
	name : string
	url : string
	type ?: number
}
interface UserListTs {
	title : string,
	Data_Arr : UserTs[]
}
export const PromentData = ref<UserTs[]>([{
	name: '全级绘本',
	url: '/static/huiben.png',
}, {
	name: 'AI评测',
	url: '/static/pingce.png',
}, {
	name: '全文翻译',
	url: '/static/fanyic.png',
}, {
	name: '学练一体',
	url: '/static/xuelian.png',
}])
export const UserList = ref<UserListTs[]>([{
	title: '学习',
	Data_Arr: [{
		name: '学情报告',
		url: '/static/xueqing.png',
		type: 1,
	}, {
		name: '阅读记录',
		url: '/static/yeudu.png',
		type: 2,
	}, {
		name: '绘本收藏',
		url: '/static/shoucang.png',
		type: 3,
	}, {
		name: 'RAZ错题',
		url: '/static/cuoti.png',
		type: 4,
	},]
}, {
	title: '其他',
	Data_Arr: [{
		name: '等级对照表',
		url: '/static/dengji.png',
		type: 5,
	}, {
		name: '电子资源下载',
		url: '/static/ziyuan.png',
		type: 6,
	}, {
		name: '微信客服',
		url: '/static/weixin.png',
		type: 7,
	}, {
		name: '会员权益',
		url: '/static/huiyuan.png',
		type: 8,
	}, {
		name: '会员兑换',
		url: '/static/duihuan.png',
		type: 9,
	}]
}])