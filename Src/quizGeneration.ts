const transcriptDump = `
0:03
the periodic nature of elements the
0:05
periodic table explained
0:07
although the periodic table of elements
0:09
looks complex it is easier to follow
0:12
once you learn how to use it first
0:14
the letters are symbols each box
0:16
represents an element each element is
0:19
made up of the same kind of atom with a
0:21
specific number of protons in its
0:23
nucleus
0:24
the atomic number for example H
0:27
represents hydrogen all hydrogen atoms
0:31
have one proton the symbol H E
0:34
represents helium all helium atoms have
0:38
two protons the elements are arranged by
0:41
increasing atomic number the atomic
0:43
number displays how many protons are
0:46
present in the nucleus of the atom the
0:48
table is also very colorful each box is
0:51
color-coded to show whether the element
0:53
is a metal or nonmetal indicating the
0:56
specific type if you take a closer look
1:00
at one element in particular you will
1:02
find its atomic number atomic mass
1:05
element name and element symbol looking
1:10
at the overall table again you will
1:11
notice that it is made up of columns and
1:13
rows the columns are known as groups and
1:17
the rows are known as periods all
1:20
elements in a group have similar
1:22
characteristics these characteristics
1:24
will tell you how many valence electrons
1:26
the electrons in the outer shell of the
1:28
atom are present in that atom giving you
1:31
an idea about how they bond here are the
1:34
element groups and the number of valence
1:36
electrons present count from the left
1:38
but skip over the transition metals
1:40
because these are a little more complex
1:43
the periods display the number of
1:46
electron shells that are present in the
1:48
atom we will not get into much detail
1:50
about this but notice that as you move
1:53
down through the periods the number of
1:55
electron shells will increase
1:59
another trend you will notice is the
2:01
size of the atom or the atomic radius as
2:06
you move down through the periods the
2:09
atoms become larger increasing the
2:11
atomic radius as you move from left to
2:15
right across the groups the atoms become
2:18
smaller decreasing the atomic radius the
2:23
opposite is true for an atoms ionization
2:25
energy or how readily an electron can be
2:28
removed from an atom as you move down
2:31
through the periods the ionization
2:33
energy will decrease as you move from
2:36
left to right across the groups the
2:38
ionization energy will increase knowing
2:42
the basic properties of the periodic
2:44
table will be beneficial to you
2:45
throughout your school career the
2:48
periodic table allows scientists to
2:50
determine the atomic structure of
2:51
elements and predict how they might
2:53
behave once you have a firm
2:55
understanding of the periodic table you
2:58
will be able to apply it to experiments
3:00
in your own classroom
`;

const GenerateQuizFromTranscript = async (transcript: string) => {
    const json = await GetChatGPTReply(`
    Here is the transcript of a YouTube video:
    ${transcript};

    Please create a 10 question mutliple choice quiz (each question has 4 options), and return your answer in the following format: { text: string, choices: string[], correctIndex: number }[]

    Ensure you've covered all the content in the video, and try to make the answer choices difficult.

    correctIndex specifies the index within the choices array which contains the correct answer (i.e. it will only ever be 0, 1, 2 or 3).

    Format the response as a JSON array with no additional text please.
    `);
    
    const quiz: Question[] = JSON.parse(json);
    return quiz;
}