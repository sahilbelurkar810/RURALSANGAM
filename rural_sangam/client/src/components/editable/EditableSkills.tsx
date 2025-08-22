import React, { useState, useEffect } from "react";

// Props interface
export interface EditableSkillsProps {
  skills: string[];
  isEditing: boolean;
  onEdit: (name: string, skills: string[]) => void;
}

// Component for editing skills
const EditableSkills: React.FC<EditableSkillsProps> = ({
  skills,
  isEditing,
  onEdit,
}) => {
  const [currentSkills, setCurrentSkills] = useState<string[]>(skills || []);
  const [newSkill, setNewSkill] = useState("");

  // Update skills when props change
  useEffect(() => {
    setCurrentSkills(skills || []);
  }, [skills]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
      const updatedSkills = [...currentSkills, newSkill.trim()];
      setCurrentSkills(updatedSkills);
      onEdit("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = currentSkills.filter(
      (skill) => skill !== skillToRemove
    );
    setCurrentSkills(updatedSkills);
    onEdit("skills", updatedSkills);
  };

  // Handle key press to add skill on Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  if (!isEditing) {
    return (
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Skills & Expertise
            </h3>
          </div>

          {currentSkills && currentSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {currentSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No skills specified</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            Editing Skills
          </h3>
        </div>

        {/* Current Skills */}
        {currentSkills && currentSkills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {currentSkills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white border border-emerald-300 rounded-md px-2 py-1 flex items-center gap-1.5 group hover:bg-emerald-50 transition-colors duration-200"
                >
                  <span className="text-emerald-800 text-xs font-medium">
                    {skill}
                  </span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Remove skill"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Skill */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a skill..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
          />
          <button
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableSkills;
