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

def calculate_grade(score: float) -> str:
    if score >= 0.9: return 'A+'
    if score >= 0.85: return 'A'
    if score >= 0.8: return 'B+'
    if score >= 0.7: return 'B'
    if score >= 0.6: return 'C+'
    if score >= 0.5: return 'C'
    if score >= 0.4: return 'D'
    return 'F'

def calculate_risk(score: float) -> str:
    if score >= 0.7: return 'Low'
    if score >= 0.5: return 'Medium'
    return 'High'

@app.get('/health')
async def health():
    return {'status': 'ok', 'model': 'EduXcel Predictor v1.0'}

@app.post('/predict', response_model=PredictionResult)
async def predict(input_data: PredictionInput):
    attendance_score = input_data.attendance / 100.0
    marks_score = input_data.internalMarks / 100.0
    sgpa_score = input_data.previousSGPA / 10.0
    assignment_score = input_data.assignmentCompletion / 100.0

    subject_scores = list(input_data.subjectPerformance.values())
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

    confidence = min(95.0, max(60.0, overall_score * 100))
    predicted_grade = calculate_grade(overall_score)
    risk_level = calculate_risk(overall_score)

    weak_subjects = [subj for subj, score in input_data.subjectPerformance.items() if score < 60]

    factors = []
    factor_data = [
        ('Attendance', attendance_score, input_data.attendance),
        ('Internal Marks', marks_score, input_data.internalMarks),
        ('Previous SGPA', sgpa_score, input_data.previousSGPA * 10),
        ('Assignment Completion', assignment_score, input_data.assignmentCompletion),
    ]

    for name, score, value in factor_data:
        contribution = score * weights[name.lower().replace(' ', '')]
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

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
