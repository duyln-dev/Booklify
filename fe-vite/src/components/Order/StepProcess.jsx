import { FaCheckCircle } from "react-icons/fa";
import "./StepProgress.scss";

const StepProgress = ({ currentStep = 1, steps = [] }) => {
  return (
    <div className="step-progress">
      {steps.map((step, index) => {
        const stepIndex = index + 1;
        const isCompleted = stepIndex < currentStep;
        const isActive = stepIndex === currentStep;

        return (
          <div key={stepIndex} className="step-item">
            <div className={`circle ${isCompleted || isActive ? "done" : ""}`}>
              {isCompleted || isActive ? <FaCheckCircle /> : stepIndex}
            </div>
            <div className={`label ${isCompleted || isActive ? "done" : ""}`}>
              {step}
            </div>
            {stepIndex < steps.length && (
              <div
                className={`line ${stepIndex < currentStep ? "done" : ""}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
