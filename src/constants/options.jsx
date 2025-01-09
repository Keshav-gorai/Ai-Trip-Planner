

export const SelectTravelsList = [
    {
        id:1, 
        title: 'Just me',
        desc: 'A solo traveller for Exploration',
        icon : '✈',
        People: '1'
    },
    {
        id:2, 
        title: 'Couples',
        desc: 'Two travellers as couple ',
        icon : '🍻🍸',
        People: '2'
    },
    {
        id:3, 
        title: 'Family',
        desc: 'A group of people for loves fun ',
        icon : '👨‍👨‍👧‍👦',
        People: '3-5 people'
    },
    {
        id:4, 
        title: 'Friends',
        desc: 'A group of people love adventures',
        icon : '🫂',
        People: '5-10 people'
    }
]

export const  SelectBudgetOption = [
    {
        id:1, 
        title: 'Cheap',
        desc: 'Stay cousious of costs',
        icon : '💵'
        
    },
    {
        id:2, 
        title: 'Moderate',
        desc: 'Average cost for group trip',
        icon : '💰'
    },
    {
        id:3, 
        title: 'Exclusive',
        desc: 'No cost Barrier',
        icon : '💸'
    }
]

export const AI_PROMPT = 'Generate travel plan for Location: {location} for {totalDays} Days for {traveller} with a {budget} budget, Give me Hotels option List, geo cordinates, rating, description for {totalDays} days with each day plan to visit there in JSON format '