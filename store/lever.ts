interface leverTs {
	name : string,
	type : number
}
interface SwiperTs {
	url ?: string
	name : string
	audio ?: string
	treeTiger ?: string,
	Word ?: string,
	bottleArr ?: bottle[]
	chinese ?: string
	correctIndex ?: number
}
interface StudyTypeItem {
	type : number // 学习类型：1=听，2=单词，3=读...
	sliderArr ?: SwiperTs[] // 该学习类型对应的所有内容
	listenIng ?: StudyListen[]
}
interface bottle {
	name ?: string
	audio ?: string,
	typeName ?: string
	chinese ?: string
	correctIndex ?: number
	isTrue : boolean
}
interface ListenTs {
	name : string,
	url : string
	key ?: string
}
interface StudyListen {
	title : string,
	audio ?: string
	listenArr : ListenTs[]
}
interface ListTs {
	id : number,
	title : string,
	location : string,
	type ?: number

	Swiper ?: SwiperTs[]
}
interface Card {
	id : number,
	url : string,
	text : string,
	learn : string,
	bgColor : string,
	type : number,
}
interface CourseItem {
	id ?: number
	type ?: number // 所属等级的type
	Swiper ?: StudyTypeItem[] // 该课程下的所有学习类型内容
	listenIng ?: StudyListen[]
}
interface SmallBox {
	id : number
	title : string,
	Card_Arr : Card[]
}
import { ref } from 'vue'
export const BoxContent = ref<SmallBox[]>([{
	id: 1,
	title: '基础学习',
	Card_Arr: [{
		id: 1,
		type: 1,
		url: '/static/ting.png',
		text: 'Listen/听',
		learn: '去学习',
		bgColor: 'radial-gradient(56.41% 56.41% at 50% 50%, #FFD39C 0%, #F38700 100%)',
	}, {
		id: 2,
		type: 2,
		url: '/static/world.png',
		text: 'World/单词',
		learn: '去学习',
		bgColor: 'radial-gradient(50% 50% at 50% 50%, #FFBAB1 0%, #EB7A73 100%)'
	}, {
		id: 3,
		type: 3,
		url: '/static/du.png',
		text: 'Read/读',
		learn: '去学习',
		bgColor: 'radial-gradient(50% 50% at 50% 50%, #C1B6F7 0%, #8985F0 100%)'
	}]
},
{
	id: 2,
	title: '巩固练习',
	Card_Arr: [{
		id: 4,
		type: 4,
		url: '/static/world.png',
		text: 'World/看词',
		learn: '去学习',
		bgColor: 'radial-gradient(56.41% 56.41% at 50% 50%, #FFD39C 0%, #F38700 100%)'
	}, {
		id: 5,
		type: 5,
		url: '/static/kan.png',
		text: 'Picture/看图',
		learn: '去学习',
		bgColor: 'radial-gradient(50% 50% at 50% 50%, #FFBAB1 0%, #EB7A73 100%)'
	}, {
		id: 6,
		type: 6,
		url: '/static/fanyi.png',
		text: 'Translate/看词翻译',
		learn: '去学习',
		bgColor: 'radial-gradient(50% 50% at 50% 50%, #D7FF7E 0%, #A7D53F 100%)'
	}, {
		id: 7,
		type: 7,
		url: '/static/chinese.png',
		text: 'Match/中英文匹配',
		learn: '去学习',
		bgColor: 'radial-gradient(50% 50% at 50% 50%, #C1B6F7 0%, #8985F0 100%)'
	}, {
		id: 8,
		type: 8,
		url: '/static/ceshi.png',
		text: 'Quiz/测验',
		learn: '去学习',
		bgColor: 'radial-gradient(56.41% 56.41% at 50% 50%, #FFD39C 0%, #F38700 100%)'
	}]
}])