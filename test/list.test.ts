import {ListUtil} from "../src/scripts/utils";

describe("List", () => {
    describe("update", () => {
        it("should return updated number list", () => {
            const list: number[] = [1, 2, 3, 4, 5];
            const actual: number[] = ListUtil.update<number>(list, (v: number) => v === 3, 100);
            const expected: number[] = [1, 2, 100, 4, 5];
            chai.assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
        });
        it("should return updated object list", () => {
            interface IObj {
                id: number;
                value: string;
            }
            const list: IObj[] = [
                { id: 1, value: "a" },
                { id: 2, value: "b" },
                { id: 3, value: "c" },
            ];
            const actual: IObj[] = ListUtil.update<IObj>(list, (v: IObj) => v.id === 2, { id: 4, value: "zzzz" });
            const expected: IObj[] = [
                { id: 1, value: "a" },
                { id: 4, value: "zzzz" },
                { id: 3, value: "c" },
            ];
            chai.assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
        });
    });
});
