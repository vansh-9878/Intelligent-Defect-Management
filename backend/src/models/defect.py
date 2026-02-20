from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DefectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    module: Optional[str] = None
    environment: Optional[str] = None


class DefectStatusUpdate(BaseModel):
    status: str


class DefectAssign(BaseModel):
    assigned_team: str

class DefectOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    module: Optional[str]
    environment: Optional[str]
    severity: Optional[str]
    status: str
    assigned_team: Optional[str]
    reporter_id: str
    created_at: datetime