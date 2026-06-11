import React from "react";

// assets
import {Bus, CU, Emart24, Metro, StoryWay, TrainStation, WooriBank} from "@assets/icons/IntlSvgs";

export const IntlGuideTable = {
	'USABLE_SERVICE': [
		{
			id: 'transportation',
			name: 'HOW_TO_USE_PAGE.TRANSPORTATION',
			items: [
				{id: 'bus', label: 'HOW_TO_USE_PAGE.BUS', image: <Bus />},
				{id: 'metro', label: 'HOW_TO_USE_PAGE.METRO', image: <Bus />},
				{id: 'express', label: 'HOW_TO_USE_PAGE.EXPRESS_BUS', image: <Bus />},
				{id: 'train', label: 'HOW_TO_USE_PAGE.TRAIN', image: <Bus />},
				{id: 'taxi', label: 'HOW_TO_USE_PAGE.SEOUL_TAXI', image: <Bus />}
			]
		},
		{
			id: 'convenience',
			name: 'HOW_TO_USE_PAGE.CONVENIENCE_STORE',
			items: [
				{id: 'storyway', label: 'HOW_TO_USE_PAGE.STORYWAY', image: <StoryWay />},
				{id: 'emart24', label: 'HOW_TO_USE_PAGE.EMART24', image: <Emart24 />},
				{id: 'cu', label: 'HOW_TO_USE_PAGE.CU', image: <CU />},
			]
		}
	],
	'RECHARGE': [
		{
			id: 'transportation',
			name: 'HOW_TO_USE_PAGE.TRANSPORTATION',
			items: [
				{id: 'subway', label: 'HOW_TO_USE_PAGE.SUBWAY_STATION', image: <Metro />},
				{id: 'train', label: 'HOW_TO_USE_PAGE.TRAIN_STATION', image: <TrainStation />},
			]
		},
		{
			id: 'convenience',
			name: 'HOW_TO_USE_PAGE.CONVENIENCE_STORE',
			items: [
				{id: 'storyway', label: 'HOW_TO_USE_PAGE.STORYWAY', image: <StoryWay />},
				{id: 'emart24', label: 'HOW_TO_USE_PAGE.EMART24', image: <Emart24 />},
				{id: 'cu', label: 'HOW_TO_USE_PAGE.CU', image: <CU />},
			]
		},
		{
			id: 'atm',
			name: 'HOW_TO_USE_PAGE.CONVENIENCE_STORE',
			items: [
				{id: 'wooribank', label: 'HOW_TO_USE_PAGE.WOORIBANK', image: <WooriBank />},
			]
		}
	],
	'REFUND': [
		{
			id: 'transportation',
			name: 'HOW_TO_USE_PAGE.TRANSPORTATION',
			items: [
				{id: 'subway', label: 'HOW_TO_USE_PAGE.SUBWAY_KORAIL', image: <Metro />},
				{id: 'train', label: 'HOW_TO_USE_PAGE.TRAIN_STATION', image: <TrainStation />},
			]
		},
		{
			id: 'convenience',
			name: 'HOW_TO_USE_PAGE.CONVENIENCE_STORE',
			items: [
				{id: 'storyway', label: 'HOW_TO_USE_PAGE.STORYWAY', image: <StoryWay />},
				{id: 'emart24', label: 'HOW_TO_USE_PAGE.EMART24', image: <Emart24 />},
				{id: 'cu', label: 'HOW_TO_USE_PAGE.CU', image: <CU />},
			]
		},
	],
}
