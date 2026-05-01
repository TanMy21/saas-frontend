import { newWayItems, oldWayItems } from "../../utils/utils";

const ProblemSolution = () => {
  return (
    <div className="ps-section">
      <div className="ps-container">
        <div className="ps-left">
          <p className="ps-label red">🥱 Old Way</p>

          <div className="ps-list">
            {oldWayItems.map((item) => {
              const Icon = item.icon;

              return (
                <div className="ps-item" key={item.title}>
                  <div className="ps-icon red">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>

                  <div className="ps-item-content">
                    <p className="ps-item-title">{item.title}</p>
                    <p className="ps-item-desc">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ps-divider">
          <div className="arrow">→</div>
        </div>

        <div className="ps-right">
          <p className="ps-label ps-blue">😎 New Way</p>

          <div className="ps-list">
            {newWayItems.map((item) => {
              const Icon = item.icon;

              return (
                <div className="ps-item" key={item.title}>
                  <div className="ps-icon blue">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>

                  <div className="ps-item-content">
                    <p className="ps-item-title">{item.title}</p>
                    <p className="ps-item-desc">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolution;
