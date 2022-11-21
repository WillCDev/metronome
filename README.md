# Metronome

Metronome is....well it's a metronome.

### **Features:**

- Start / Stop button to save your sanity.
- Manually set the tempo by using the built in "BPM WHeel" and dragging it to the tempo you want.
- Adjust the BPM incrementally using the up and down arrows on your keyboard.
- "Tap" a tempo and the metronome will auto detect the correct tempo.

<br/>

## **Screenshots**

`![Writing](https://unsplash.com/photos/VBPzRgd7gfc)`

<br />

## **Technologies / Methodologies / Approach**

### **Frameworks / Libs**

- React
- Embla (Small package to provide vertical circular carousel for the "BPM Wheel")

### **Tooling**

- Vite
- Eslint / Prettier
- Typescript
- PostCSS/Autoprefixer
- Browserlist

### **Styling**

I've use Sass with css modules for easy namespacing of generated classes.
I've used a central shared set of variables and mixins that are exposed globally using the Vite config for common styling attributes.

We're using PostCSS / Autoprefixer to add vendor prefixing to our compiled CSS in line with our browserlist configs.

### **Testing / Robustness**

I've used Typescript with extremely strict rules enabled. This gives a high level of robustness immediately without any tests.
However the project is configured to support Jest tests, and I think there is scope here for some unit and integration testing, especially around the beat detection stuff.

I simply haven't had enough time to write any yet, but they're very much TODO.

### **Beat Detection**

I've used a fairly crude method of beat detection that averages the intervals of the last n (configurable), tap events.
I've also added various timers to prioritise UX and make sure the user is never waiting to long for a detection even to trigger, even if they keep clicking.

Most aspects of the algorithm are configurable from a single confiugration file for easy refinement of the detection accuracy and timing moving forway.

I think there's definitely room to improve this algorithm, which is discussed below, but I think for now this solution is sufficient for the scope of the task.

### **Audio Click Generator**

This is an interesting topic. The obvious solution to avoid is using native JS timers on the main thread as these are quite predictably unpredictable in their accuracy. This led me to do a little research around the most accurate ways to produce a steady beat in th browser.

I discovered this great article https://meowni.ca/posts/metronomes/ which laid out some fun experiments to understand the pros and cons of different approaches. I used this as the basis of my solution.

In the end I decided to offload the timers onto a dedicated WebWorker which in turn callback to the main thread to trigger the click sound. This gives a lot more predictability to the beat as the WebWorker is a single thread that is only running the timer.

In theory, there is still the possibly of instability if there is work happening on the main thread that would cause a delay in the processing of the WebWorker callback, as is documented in the above link, however in reality in the context of our app this is not the case, and so this solution is good. THe trade of being that we get a slightly cleaner more elegant solution than using pre-scheduled events.

However if in the future this was no longer the case, obviously it makes sense to refactor to a "pre-schedule WebAudio events" patterns, and the Metronome class is designed to make this refactor as simple as possible.

## **Setup**

- download or clone the repository
  `npm install`

## **Develop**

Since we're using Vite, the development experience is supe fast.

`npm run dev`

## **Test**

This will run type-checking and eslint checks. Once we have tests we will also run unit/integration tests here too.

`npm run test`

## **Build**

`npm run build`

## **Future Improvements**

- Add tests!!!
- Add the ability to manually set the BPM using a number input, or slider.
  The "BPM Wheel" is fun, but it's kinda a faff.
- Replace Embla with a custom solution. It's OK, but actually for what we're doing, it wouldn't take much to implement a dedicated solution. I think the library is doing a lot under the hood on the JS thread to support features that we do not need/use.
- Add Stylelint to the tooling - Linting for Styles, since we're using Sass.
- Look at switching out the Audio Click generation from using a simple sine tone generator, to triggering a sound file, opening up the possibility of a configurable click sound.
- Add something visual, like a flash or pulse that matches the beat. The tricky part here will be synchronising this with the sound with minimal (ideally 0) delay. We for sure would want to do this outside of the React render lifecycle and manipulate the DOM directly from our callback.
- Add more finesse to the Beat detection algorithm. Main issues for me atm:

  - It's a little 'Jumpy', once we hit the "NUM_OF_INTERVALS_FOR_DETECTION" the detection happens quite rapidly making the UI a little jumpy. Probably want to debounce this a little.
  - We're currently just taking the last 2->NUM_OF_INTERVALS_FOR_DETECTION events and finding the mean. However a single rogue click at either the start or end of the sample set could greatly skew the average. It would be cool to do some comparisons that identify and discount outliers in a set to improve accuracy.
