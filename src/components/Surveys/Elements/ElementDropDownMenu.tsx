import { useEffect, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";

import {
  useDeleteElementMutation,
  useDuplicateElementMutation,
} from "../../../app/slices/elementApiSlice";
import {
  setQuestion,
  setSelectedQuestionId,
} from "../../../app/slices/elementSlice";
import { deleteElementRedux } from "../../../app/slices/surveySlice";
import { RootState } from "../../../app/store";
import { useAppSelector, useAppDispatch } from "../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../context/BuilderRefetchCanvas";
import useAuth from "../../../hooks/useAuth";
import { ElementDropDownMenuProps } from "../../../utils/types";
import DeleteQuestionAlert from "../../alert/DeleteQuestionAlert";

const ElementDropDownMenu = ({
  questionID,
  isSystemScreen,
}: ElementDropDownMenuProps) => {
  const dispatch = useAppDispatch();
  const { can } = useAuth();
  const refetchCanvas = useSurveyCanvasRefetch();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [recentlyDeletedId, setRecentlyDeletedId] = useState<string | null>(
    null,
  );

  const [duplicateQuestion] = useDuplicateElementMutation();
  const [deleteElement, { isLoading }] = useDeleteElementMutation();

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements,
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleDuplicateElement = async () => {
    try {
      if (!can("CREATE_QUESTION")) return;
      setMenuAnchor(null);

      const newQuestion = await duplicateQuestion(questionID).unwrap();

      refetchCanvas();

      dispatch(setQuestion(newQuestion));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteElement = async () => {
    try {
      if (!can("DELETE_QUESTION")) return;

      setMenuAnchor(null);
      await deleteElement(questionID).unwrap();
      setRecentlyDeletedId(questionID);

      refetchCanvas();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!recentlyDeletedId || elements.length === 0) return;

    const index = elements.findIndex((e) => e.questionID === recentlyDeletedId);

    if (index === 0 && elements.length > 1) {
      dispatch(setQuestion(elements[1]));
    } else if (index > 0) {
      dispatch(setQuestion(elements[index - 1]));
    } else {
      dispatch(setSelectedQuestionId(null));
    }

    dispatch(deleteElementRedux(recentlyDeletedId));
    setRecentlyDeletedId(null);
  }, [elements, recentlyDeletedId, dispatch]);

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ marginRight: "8%" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          left: "2%",
          top: "-4%",
        }}
      >
        {!isSystemScreen && can("CREATE_QUESTION") && (
          <MenuItem onClick={handleDuplicateElement}>Duplicate</MenuItem>
        )}

        {can("DELETE_QUESTION") && (
          <MenuItem onClick={handleDeleteElement} sx={{ color: "red" }}>
            {isSystemScreen ? "Remove Screen" : "Delete"}
          </MenuItem>
        )}
      </Menu>

      <DeleteQuestionAlert open={isLoading} />
    </>
  );
};

export default ElementDropDownMenu;
