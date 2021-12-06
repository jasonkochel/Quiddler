import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({ id, showBack, dndDisabled, dndData }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: dndDisabled,
    data: dndData,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  let letter, value;
  if (!!id && id.indexOf("-") > -1) {
    [letter, value] = id.split("-");
  }

  return (
    <div
      className={`my-1 bg-white h-16 w-[40px] mx-1 rounded cursor-pointer bg-cover bg-center bg-no-repeat ${
        showBack ? "bg-card-back" : "bg-none"
      }`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {!showBack && (
        <div className="flex flex-col h-full text-center justify-evenly">
          <div className="text-2xl">{letter}</div>
          <div className="text-gray-500">{value}</div>
        </div>
      )}
    </div>
  );
};

const DragOverlayCard = ({ id, showBack }) => {
  let letter, value;
  if (!!id && id.indexOf("-") > -1) {
    [letter, value] = id.split("-");
  }

  return (
    <div
      className={`my-1 bg-white h-16 w-[40px] mx-1 rounded cursor-pointer bg-cover bg-center bg-no-repeat ${
        showBack ? "bg-card-back" : "bg-none"
      }`}
    >
      {!showBack && (
        <div className="flex flex-col h-full text-center justify-evenly">
          <div className="text-2xl">{letter}</div>
          <div className="text-gray-500">{value}</div>
        </div>
      )}
    </div>
  );
};

const SmallCard = ({ letter }) => (
  <div className="h-10 w-[25px] my-1 ml-1 bg-white rounded cursor-pointer">
    <div className="flex flex-col h-full text-center justify-evenly">
      <div className="text-xl">{letter}</div>
    </div>
  </div>
);

export { Card as default, DragOverlayCard, SmallCard };
