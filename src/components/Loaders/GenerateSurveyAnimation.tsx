import "./generate-animation.css";

const GenerateSurveyAnimation = () => {
  return (
    <div className="loader">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className={`box box${i}`}>
          <div></div>
        </div>
      ))}
      <div className="ground">
        <div></div>
      </div>
    </div>
  );
};

export default GenerateSurveyAnimation;
