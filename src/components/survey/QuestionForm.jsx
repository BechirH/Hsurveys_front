import React, { useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const QUESTION_TYPES = [
  "RATING_SCALE_ICONS",
  "FREE_TEXT",
  "DATE_PICKER",
  "MULTIPLE_CHOICE_TEXT",
  "MULTIPLE_CHOICE_IMAGE",
  "NUMERIC_SCALE",
  "YES_NO"
];

const QuestionForm = ({ onSubmit, loading, error }) => {
  const [form, setForm] = useState({
    subject: "",
    questionText: "",
    questionType: QUESTION_TYPES[0],
    locked: false,
    options: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          optionText: "",
          optionScore: 0,
          isCorrect: false,
          isLocked: false,
        },
      ],
    }));
  };

  const handleRemoveOption = (index) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setForm((prev) => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      return { ...prev, options: updatedOptions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white shadow">
      <InputField
        id="subject"
        label="Sujet"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <InputField
        id="questionText"
        label="Question"
        name="questionText"
        value={form.questionText}
        onChange={handleChange}
        as="textarea"
        className="resize-y"
        required
        disabled={loading}
      />

      <label htmlFor="questionType" className="block font-semibold mb-1">Type de question</label>
      <select
        id="questionType"
        name="questionType"
        value={form.questionType}
        onChange={handleChange}
        className="mb-4 p-2 border rounded w-full"
        disabled={loading}
      >
        {QUESTION_TYPES.map(type => (
          <option key={type} value={type}>
            {type.replace('_', ' ')}
          </option>
        ))}
      </select>

      <div className="mb-3 flex items-center">
        <input
          type="checkbox"
          id="locked"
          name="locked"
          checked={form.locked}
          onChange={handleChange}
          className="mr-2"
          disabled={loading}
        />
        <label htmlFor="locked" className="font-semibold">Verrouiller la question</label>
      </div>

      {form.questionType !== "FREE_TEXT" && (
  <div className="mt-4 space-y-2">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold text-gray-700">Options</h4>
      <Button
        type="button"
        onClick={handleAddOption}
        variant="primary"
        disabled={loading}
      >
        Ajouter une option
      </Button>
    </div>

    {form.options.map((option, index) => (
  <div key={index} className="flex space-x-4 items-center">
    <input
      type="text"
      placeholder="Option text"
      value={option.optionText}
      onChange={(e) =>
        handleOptionChange(index, "optionText", e.target.value)
      }
      className="input-base flex-grow"  // prend tout l'espace possible sauf celui du score
    />
    <input
      type="number"
      placeholder="Score"
      value={option.optionScore}
      onChange={(e) =>
        handleOptionChange(index, "optionScore", Number(e.target.value))
      }
      className="input-base w-10"  
    />
    <label className="text-sm flex items-center space-x-1">
      <input
        type="checkbox"
        checked={option.isCorrect}
        onChange={(e) =>
          handleOptionChange(index, "isCorrect", e.target.checked)
        }
      />
      <span>Correct</span>
    </label>
    <button
  type="button"
  onClick={() => handleRemoveOption(index)}
  className="text-red-600 hover:text-red-800 text-lg font-bold px-1"
  aria-label="Supprimer option"
  title="Delete"  
>
  &times;
</button>
  </div>
))}
  </div>
)}

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="mt-6">
  <Button type="submit" loading={loading} fullWidth disabled={loading}>
    Créer la question
  </Button>
</div>
    </form>
  );
};

export default QuestionForm;