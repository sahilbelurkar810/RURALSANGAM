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
      <div className="mb-6">
        <h2 className="text-lg font-medium">Skills</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {currentSkills && currentSkills.length > 0 ? (
            currentSkills.map((skill, index) => (
              <span key={index} className="badge badge-primary">
                {skill}
              </span>
            ))
          ) : (
            <p className="opacity-80">No skills specified</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium">Skills</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {currentSkills && currentSkills.length > 0 ? (
          currentSkills.map((skill, index) => (
            <div key={index} className="badge badge-primary gap-1">
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="badge-sm"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <p className="opacity-80">No skills specified</p>
        )}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a skill"
          className="input input-bordered flex-1 mr-2 bg-base-200"
        />
        <button onClick={handleAddSkill} className="btn btn-sm btn-accent">
          Add
        </button>
      </div>
    </div>
  );
};

export default EditableSkills;
