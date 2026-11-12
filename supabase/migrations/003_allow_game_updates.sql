-- Allow anonymous family updates (same trust model as insert).
drop policy if exists "Public update games" on public.games;
create policy "Public update games"
  on public.games for update
  to anon, authenticated
  using (true)
  with check (
    char_length(trim(title)) > 0
    and char_length(trim(age_group)) > 0
    and char_length(trim(play_format)) > 0
    and char_length(trim(materials)) > 0
  );

-- Fix Hat Hook Challenge fields
update public.games
set
  play_format = 'Individual',
  duration = '14 sec',
  instructions_en = E'- Set up a horizontal rope or string and hang several rings from it at a suitable height.\n- Give each player an upside-down plastic basket fitted with a hook on top.\n- Players must wear the baskets on their heads and keep their hands behind their backs.\n- When the game begins, players must carefully move their heads and bodies to align their hooks with the hanging rings.\n- Players must catch a ring using only the hook attached to their basket, without touching it with their hands.\n- The first player to successfully hook a ring wins the round.\n\nSafety: Use lightweight baskets and blunt, securely attached hooks. Keep the playing area clear and ensure children are supervised by adults.',
  instructions_kn = E'- ಒಂದು ಹಗ್ಗವನ್ನು ಎತ್ತರದಲ್ಲಿ ಕಟ್ಟಿ, ಅದಕ್ಕೆ ಕೆಲವು ಉಂಗುರಗಳನ್ನು ನೇತುಹಾಕಿ.\n- ಪ್ರತಿಯೊಬ್ಬ ಆಟಗಾರನಿಗೂ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಕೊಕ್ಕೆ ಅಳವಡಿಸಿರುವ ತಲೆಕೆಳಗಾದ ಪ್ಲಾಸ್ಟಿಕ್ ಬುಟ್ಟಿಯನ್ನು ನೀಡಿ.\n- ಆಟಗಾರರು ಆ ಬುಟ್ಟಿಯನ್ನು ತಲೆಯ ಮೇಲೆ ಧರಿಸಿ, ತಮ್ಮ ಕೈಗಳನ್ನು ಹಿಂದೆ ಇಟ್ಟುಕೊಳ್ಳಬೇಕು.\n- ಆಟ ಪ್ರಾರಂಭವಾದ ನಂತರ, ತಲೆ ಮತ್ತು ದೇಹವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಚಲಿಸಿ, ಬುಟ್ಟಿಯ ಮೇಲಿರುವ ಕೊಕ್ಕೆಯನ್ನು ನೇತಾಡುತ್ತಿರುವ ಉಂಗುರಕ್ಕೆ ಹೊಂದಿಸಬೇಕು.\n- ಕೈಗಳನ್ನು ಬಳಸದೆ, ಬುಟ್ಟಿಯ ಮೇಲಿರುವ ಕೊಕ್ಕೆಯ ಸಹಾಯದಿಂದ ಉಂಗುರವನ್ನು ಸಿಕ್ಕಿಸಿಕೊಳ್ಳಬೇಕು.\n- ಮೊದಲು ಉಂಗುರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಿಕ್ಕಿಸಿಕೊಳ್ಳುವ ಆಟಗಾರನು ವಿಜೇತನಾಗುತ್ತಾನೆ.'
where id = '443c2ff3-6599-4fc6-88e2-060c287aa81a';
