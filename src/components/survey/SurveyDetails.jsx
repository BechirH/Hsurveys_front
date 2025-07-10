import React from "react";
import Button from "../common/Button";


const SurveyDetails = ({ survey, onAddQuestions }) => {
  if (!survey) return null;

  return (
    <div className="p-4 bg-gray-50 rounded border">
      <p><strong>Owner ID:</strong> {survey.ownerId}</p>
      <p><strong>Type:</strong> {survey.type}</p>
      <p><strong>Title:</strong> {survey.title}</p>
      <p><strong>Description:</strong> {survey.description}</p>
      <p><strong>Status:</strong> {survey.status}</p>
      <p><strong>Created At:</strong> {new Date(survey.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(survey.updatedAt).toLocaleString()}</p>
      <p><strong>Deadline:</strong> {survey.deadline ? new Date(survey.deadline).toLocaleString() : "No deadline"}</p>
      <p><strong>Locked:</strong> {survey.locked ? "Yes" : "No"}</p>
      <p><strong>Questions:</strong> {survey.questions ? survey.questions.length : "None"}</p>
      {onAddQuestions && (
        <div className="mt-4">
          <Button onClick={onAddQuestions}>Add Questions</Button>
        </div>
      )}
    </div>
  );
};

export default SurveyDetails;