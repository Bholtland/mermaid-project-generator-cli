export default {
    objectRelations:
        /(\S+) ((<\|-{2,})|(-{2,}\|>)|(<-{2,})|(-{2,}>)|(\*-{2,})|(-{2,}\*)|(o-{2,})|(-{2,}o)|(-{2,})|(<\.{2,})|(\.{2,}>)|(<\|\.{2,})|(\.{2,}\|>)|(\.{2,})) (\S+)/gm,
    objects: /(class [^}]*})/gm,
    objectParts:
        /class ([^ ~]*)(~\S+~)? {(\n.*%% module: ?([^ ]*))?(\n *(<<\S+>>))?\n([^}]+)/gm,
    members:
        /^ *([+\-#])? ?([a-zA-Z0-9]+)(\(([a-zA-Z0-9 :,]+)?\))?(: ?(\S+))?/gm,
    methodArgs: /([a-zA-Z0-9]+): ?([a-zA-Z0-9]+)/gm,
    objectGenerics: /([a-zA-Z0-9]+)/gm,
    objectNamePatterns:
        /(^(I)([A-Z]{1}(\S+)?))?((\S+)((Service)|(Factory)|(Client)))?/gm,
};
