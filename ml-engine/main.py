from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List, Optional
import numpy as np

app = FastAPI(title="EduXcel ML Engine", version="1.0.0")


class PredictionInput(BaseModel):
    attendance: float
    internalMarks: float
    previousSGPA: float
    assignmentCompletion: float
    subjectPerformance: Dict[str, float]
    semester: int
    userId: Optional[str] = None
    studyHours: Optional[float] = None
    learningStyle: Optional[str] = None


class FactorContribution(BaseModel):
    factor: str
    impact: str
    value: float
    contribution: float


class PredictionResult(BaseModel):
    predictedGrade: str
    riskLevel: str
    confidence: float
    factors: List[FactorContribution]
    weakSubjects: List[str]
    recommendations: List[str]


class RecommendInput(BaseModel):
    subjects: List[str]
    userId: Optional[str] = None
    subjectPerformance: Optional[Dict[str, float]] = None
    attendance: Optional[float] = None
    internalMarks: Optional[float] = None
    previousSGPA: Optional[float] = None
    assignmentCompletion: Optional[float] = None
    semester: Optional[int] = None
    studyHours: Optional[float] = None
    learningStyle: Optional[str] = None


class VideoResult(BaseModel):
    title: str
    link: str
    channel: str
    channelId: str
    thumbnail: str
    views: str
    duration: str
    isTopPick: bool = False


class RecommendResponse(BaseModel):
    prediction: PredictionResult
    videos: List[VideoResult]
    topPickIndex: int


class RecoveryPlanResponse(BaseModel):
    predictedGrade: str
    riskLevel: str
    confidence: float
    weakSubjects: List[str]
    recommendations: List[dict]
    videoRecommendations: List[VideoResult]


def calculate_grade(score: float) -> str:
    if score >= 0.9:
        return 'A+'
    if score >= 0.85:
        return 'A'
    if score >= 0.8:
        return 'B+'
    if score >= 0.7:
        return 'B'
    if score >= 0.6:
        return 'C+'
    if score >= 0.5:
        return 'C'
    if score >= 0.4:
        return 'D'
    return 'F'


def calculate_risk(score: float) -> str:
    if score >= 0.7:
        return 'Low'
    if score >= 0.5:
        return 'Medium'
    return 'High'


@app.get('/health')
async def health():
    return {'status': 'ok', 'model': 'EduXcel Predictor v1.0'}


@app.get('/', include_in_schema=False)
async def home():
    return "API is live."


@app.post('/predict', response_model=PredictionResult)
async def predict(input_data: PredictionInput):
    attendance_score = input_data.attendance / 100.0
    marks_score = input_data.internalMarks / 100.0
    sgpa_score = input_data.previousSGPA / 10.0
    assignment_score = input_data.assignmentCompletion / 100.0

    subject_scores = []
    subject_perf_clean = {}
    for subj, score in input_data.subjectPerformance.items():
        if not subj.startswith('_'):
            subject_scores.append(score)
            subject_perf_clean[subj] = score

    subject_avg = np.mean(subject_scores) / 100.0 if subject_scores else 0.5

    weights = {
        'attendance': 0.30,
        'marks': 0.30,
        'sgpa': 0.20,
        'assignments': 0.10,
        'subjects': 0.10,
    }

    overall_score = (
        attendance_score * weights['attendance'] +
        marks_score * weights['marks'] +
        sgpa_score * weights['sgpa'] +
        assignment_score * weights['assignments'] +
        subject_avg * weights['subjects']
    )

    if input_data.studyHours is not None:
        study_factor = min(1.0, input_data.studyHours / 8.0)
        overall_score = overall_score * 0.85 + study_factor * 0.15

    confidence = min(95.0, max(60.0, overall_score * 100))
    predicted_grade = calculate_grade(overall_score)
    risk_level = calculate_risk(overall_score)

    weak_subjects = [
        subj for subj, score in subject_perf_clean.items()
        if score < 60
    ]

    factors = []
    factor_data = [
        ('Attendance', attendance_score, input_data.attendance),
        ('Internal Marks', marks_score, input_data.internalMarks),
        ('Previous SGPA', sgpa_score, input_data.previousSGPA * 10),
        ('Assignment Completion', assignment_score, input_data.assignmentCompletion),
    ]

    for name, score, value in factor_data:
        weight_key = name.lower().replace(' ', '')
        contribution = score * weights.get(weight_key, 0.25)
        impact = 'Positive' if score >= 0.7 else ('Critical Negative' if score < 0.5 else 'Moderate Negative')
        factors.append(FactorContribution(
            factor=name,
            impact=impact,
            value=value,
            contribution=round(contribution, 3)
        ))

    recommendations = []
    if input_data.attendance < 75:
        recommendations.append('Improve attendance to above 75% for better outcomes')
    if input_data.internalMarks < 60:
        recommendations.append('Focus on internal assessments and practice tests')
    if input_data.assignmentCompletion < 70:
        recommendations.append('Complete pending assignments on time')
    for subj in weak_subjects:
        recommendations.append(f'Dedicate extra study time to {subj}')
    if not recommendations:
        recommendations.append('Keep maintaining your strong academic performance')

    return PredictionResult(
        predictedGrade=predicted_grade,
        riskLevel=risk_level,
        confidence=round(confidence, 1),
        factors=factors,
        weakSubjects=weak_subjects,
        recommendations=recommendations
    )


@app.post('/simulate', response_model=PredictionResult)
async def simulate(input_data: PredictionInput):
    return await predict(input_data)


def _search_youtube(query: str, limit: int = 5):
    from youtubesearchpython import VideosSearch
    search = VideosSearch(query, limit=limit)
    search_result = search.result()
    videos = []
    if search_result and 'result' in search_result and len(search_result['result']) > 0:
        for video in search_result['result']:
            channel_info = video.get('channel', {})
            if isinstance(channel_info, dict):
                channel_name = channel_info.get('name', '')
                channel_id = channel_info.get('id', '')
            else:
                channel_name = str(channel_info)
                channel_id = ''
            thumbnails = video.get('thumbnails', [{}])
            thumbnail_url = ''
            if thumbnails:
                thumbnail_url = thumbnails[0].get('url', '')
            view_count = video.get('viewCount', {})
            views_text = ''
            if isinstance(view_count, dict):
                views_text = view_count.get('text', '')
            videos.append(VideoResult(
                title=video.get('title', ''),
                link=video.get('link', ''),
                channel=channel_name,
                channelId=channel_id,
                thumbnail=thumbnail_url,
                views=views_text,
                duration=video.get('duration', ''),
                isTopPick=False
            ))
    return videos


def _generate_search_queries(subject: str, learning_style: Optional[str] = None):
    queries = []
    if learning_style and 'visual' in learning_style.lower():
        queries.append(f"{subject} explained visually tutorial 2024")
    elif learning_style and 'auditory' in learning_style.lower():
        queries.append(f"{subject} lecture class explanation")
    else:
        queries.append(f"{subject} tutorial for beginners")
    queries.append(f"{subject} explained simply")
    queries.append(f"{subject} key concepts examples")
    return queries


@app.post('/recommend', response_model=RecommendResponse)
async def recommend(input_data: RecommendInput):
    subject_perf = input_data.subjectPerformance or {}

    prediction_input = PredictionInput(
        attendance=input_data.attendance or 70,
        internalMarks=input_data.internalMarks or 60,
        previousSGPA=input_data.previousSGPA or 6.0,
        assignmentCompletion=input_data.assignmentCompletion or 50,
        subjectPerformance=subject_perf,
        semester=input_data.semester or 1,
        userId=input_data.userId,
        studyHours=input_data.studyHours,
        learningStyle=input_data.learningStyle,
    )

    prediction = await predict(prediction_input)

    targets = input_data.subjects if input_data.subjects else prediction.weakSubjects
    if not targets:
        targets = [s for s, v in subject_perf.items() if v < 60]

    all_videos = []
    for subject in targets:
        queries = _generate_search_queries(subject, input_data.learningStyle)
        for query in queries:
            videos = _search_youtube(query, limit=2)
            if videos:
                all_videos.extend([v.model_copy(update={'isTopPick': False}) for v in videos])
                break

    seen_links = set()
    unique_videos = []
    for v in all_videos:
        if v.link not in seen_links:
            seen_links.add(v.link)
            unique_videos.append(v)

    if unique_videos:
        unique_videos[0].isTopPick = True

    top_pick_index = 0 if unique_videos else -1

    return RecommendResponse(
        prediction=prediction,
        videos=unique_videos,
        topPickIndex=top_pick_index
    )


@app.post('/recovery-plan', response_model=RecoveryPlanResponse)
async def recovery_plan(input_data: RecommendInput):
    subject_perf = input_data.subjectPerformance or {}

    prediction_input = PredictionInput(
        attendance=input_data.attendance or 70,
        internalMarks=input_data.internalMarks or 60,
        previousSGPA=input_data.previousSGPA or 6.0,
        assignmentCompletion=input_data.assignmentCompletion or 50,
        subjectPerformance=subject_perf,
        semester=input_data.semester or 1,
        userId=input_data.userId,
        studyHours=input_data.studyHours,
        learningStyle=input_data.learningStyle,
    )

    prediction = await predict(prediction_input)

    targets = input_data.subjects if input_data.subjects else prediction.weakSubjects
    if not targets:
        targets = [s for s, v in subject_perf.items() if v < 60]

    all_videos = []
    for subject in targets:
        queries = _generate_search_queries(subject, input_data.learningStyle)
        for query in queries:
            videos = _search_youtube(query, limit=3)
            if videos:
                all_videos.extend([v.model_copy(update={'isTopPick': False}) for v in videos])
                break

    seen_links = set()
    unique_videos = []
    for v in all_videos:
        if v.link not in seen_links:
            seen_links.add(v.link)
            unique_videos.append(v)

    if unique_videos:
        unique_videos[0].isTopPick = True

    status_sequence = ['done', 'in_progress', 'pending']
    recommendations_list = []
    recs = prediction.recommendations or []
    for i, rec in enumerate(recs):
        status = status_sequence[min(i, len(status_sequence) - 1)]
        desc = ''
        if prediction.weakSubjects:
            matched = next((ws for ws in prediction.weakSubjects if ws.lower() in rec.lower()), None)
            if matched:
                desc = f'Targeted action for {matched}.'
        if not desc:
            desc = 'Follow the AI-guided roadmap to improve your metrics.'
        recommendations_list.append({'step': rec, 'desc': desc, 'status': status})

    if not recommendations_list:
        recommendations_list.append({
            'step': 'Review weak areas',
            'desc': 'Focus on subjects where scores are below 60%.',
            'status': 'in_progress'
        })

    return RecoveryPlanResponse(
        predictedGrade=prediction.predictedGrade,
        riskLevel=prediction.riskLevel,
        confidence=prediction.confidence,
        weakSubjects=prediction.weakSubjects,
        recommendations=recommendations_list,
        videoRecommendations=unique_videos
    )


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
