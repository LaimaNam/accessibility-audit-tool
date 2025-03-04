import fs from "fs";

export const saveIssuesToFile = (
  issues: unknown,
  filename: string = "accessibility_issues.json"
) => {
  const data = JSON.stringify(issues, null, 2);
  fs.writeFileSync(filename, data);
  console.log(`Issues saved to ${filename}`);
};
