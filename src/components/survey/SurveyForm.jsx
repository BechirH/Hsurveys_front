import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const SURVEY_TYPES = ["FEEDBACK", "EXAM"];

const SurveyForm = ({ form, setForm, onSubmit, loading, error }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="mb-6 p-4 border rounded bg-white shadow">
      <InputField
        id="title"
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <InputField
        id="description"
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        as="textarea"
        className="resize-y"
        disabled={loading}
      />

      <label className="block font-semibold mb-1" htmlFor="type">Type</label>
      <select
        id="type"
        name="type"
        value={form.type}
        onChange={handleChange}
        className="mb-4 p-2 border rounded w-full"
        disabled={loading}
      >
        {SURVEY_TYPES.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>

      <InputField
        id="deadline"
        label="Date limite"
        name="deadline"
        type="datetime-local"
        value={form.deadline}
        onChange={e => setForm({...form, deadline: e.target.value})}
        disabled={loading}
      />

      {/* Erreur */}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      
        <div className="flex justify-center gap-4 mt-6">
  <Button
    type="submit"
    loading={loading}
    disabled={loading}
    className="w-40 text-center justify-center"
  >
    Submit
  </Button>
</div>
      
    </form>
  );
};

export default SurveyForm;
