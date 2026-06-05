import { type DropResult } from "react-beautiful-dnd";

import { OptionType } from "../utils/types";

export type DropdownPermissions = {
  canCreate: boolean;
  canReorder: boolean;
  canDelete: boolean;
  canEdit: boolean;
};

export type DropdownOptionManagerProps = {
  qID: string;
  options: OptionType[];
  canReorder: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onDragEnd: (result: DropResult) => void;
  onDelete: (optionID: string) => void;
};
