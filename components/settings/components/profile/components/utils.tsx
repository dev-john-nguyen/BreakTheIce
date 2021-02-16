import { InterviewProps } from "../../../../../services/user/types"

export const likesQuestions = [
    "What’s your favorite way to spend a day off?",
    "What type of music are you into?",
    "What was the best vacation you ever took and why?",
    "Where’s the next place on your travel bucket list and why?",
    "What are your hobbies, and how did you get into them?",
    "What was your favorite age growing up?",
    "Was the last thing you read?",
    "Would you say you’re more of an extrovert or an introvert?",
    "What's your favorite ice cream topping?",
    "What was the last TV show you binge-watched?'"
]

export const carrerQuestions = [
    "What’s your favorite thing about your current job?",
    "What annoys you most?",
    "What’s the career highlight you’re most proud of?",
    "Do you think you’ll stay in your current gig awhile? Why or why not?",
    "What type of role do you want to take on after this one?",
    "Are you more of a work to live or a live to work type of person?",
    "Does your job make you feel happy and fulfilled? Why or why not?",
    "How would your 10-year-old self react to what you do now?",
    "What do you remember most about your first job?",
    "How old were you when you started working?",
    "What’s the worst job you’ve ever had?",
    "What originally got you interested in your current field of work?",
    "Have you ever had a side hustle or considered having one?",
    "What’s your favorite part of the workday?",
    "What’s the best career decision you’ve ever made?",
    "What’s the worst career decision you’ve ever made?",
    "Do you consider yourself good at networking?",
    "What career advice would you give to your younger self?",
    "Do you believe in having a five-year plan?",
]

export const familyQuestions = [
    "How much time do you spend with your family?",
    "Who do you most like spending time with and why?",
    "Were you close with your family growing up?",
    "How do you define your family now?",
    "What traits are most important to you in your family members?",
    "Who are you the closest to and why?",
    "Do you want a family of your own?",
    "What’s your favorite family tradition?",
    "If you could change your relationship with a family member, would you? If so, with whom?",
    "What was it like growing up as the youngest/oldest/middle/only child?",
    "Does your family ever take trips together?",
    "What’s your favorite family memory?",
    "What TV family most reminds you of your own?",
    "Do you ever wish you were raised differently?",
    "What’s the best piece of advice a family member has given you?",
    "Do you wish you had more siblings? If so, why?",
    "Did you ever hide anything from or lie to your parents?"
]

export const valuesQuestions = [
    "What’s a relationship deal breaker for you?",
    "If you had only one sense (hearing, touch, sight, etc.), which would you want?",
    "What is your definition of success?",
    "What makes you feel at peace?",
    "What are you most proud of in the last year?",
    "What makes you feel most accomplished?",
    "Who do you admire most in the world?",
    "Would you rather make more money doing a job you hate or less doing one you love?",
    "Which of your personality traits are you most proud of?"
]

export const likesInitIndex = likesQuestions[Math.round(likesQuestions.length / 2)]
export const valuesInitIndex = valuesQuestions[Math.round(likesQuestions.length / 2)]
export const familyInitIndex = familyQuestions[Math.round(likesQuestions.length / 2)]
export const carrerInitIndex = carrerQuestions[Math.round(likesQuestions.length / 2)]

export type InterviewKeys = keyof InterviewProps

export const interviewKeys: InterviewKeys[] = ['likes', 'career', 'family', 'values']