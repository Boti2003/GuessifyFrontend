/*export function StartPage() {
   const [mode, setMode] = useState<ApplicationMode>(null);

   return (
      <div>
         {mode === null && <ChooseApplicationModePage setMode={setMode} />}
         {mode === ApplicationMode.User && <LoginPage stepBack={setMode} />}
         {mode === ApplicationMode.Guest && (
            <ChooseRolePage stepBack={setMode} />
         )}
      </div>
   );
}*/
