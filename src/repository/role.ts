interface RoleTypes {
  value: number;
  label: string;
}

const Roles: RoleTypes[] = [
  {
    value: 0,
    label: "老師 (Teacher)",
  },
  {
    value: 1,
    label: "助教 (TA)",
  },
  {
    value: 2,
    label: "學生 (Student)",
  },
];

const DefaultRoleTypeId = 2;

export { Roles, DefaultRoleTypeId };
