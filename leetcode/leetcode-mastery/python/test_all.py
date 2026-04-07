"""Tests for all 12 phases — run with: python -m pytest python/test_all.py -v"""

from phase1_arrays import two_sum, group_anagrams, longest_consecutive
from phase2_twopointers import is_palindrome, length_of_longest_substring, min_window
from phase3_stack import is_valid, daily_temperatures, largest_rectangle_area
from phase4_binarysearch import binary_search, search_rotated, find_median_sorted_arrays
from phase5_to_8 import (
    reverse_list, merge_k_lists, from_list, to_list, ListNode,
    max_depth, level_order, TreeNode,
    climb_stairs, length_of_lis, min_distance,
    subsets, exist, solve_n_queens,
)
from phase9_to_12 import (
    num_islands, can_finish, ladder_length,
    find_kth_largest, top_k_frequent, MedianFinder,
    can_jump, least_interval,
    merge_intervals, erase_overlap_intervals,
)


# === Phase 1 ===
def test_two_sum(): assert two_sum([2, 7, 11, 15], 9) == [0, 1]
def test_two_sum_middle(): assert two_sum([3, 2, 4], 6) == [1, 2]
def test_group_anagrams(): assert len(group_anagrams(["eat","tea","tan","ate","nat","bat"])) == 3
def test_longest_consecutive(): assert longest_consecutive([100, 4, 200, 1, 3, 2]) == 4
def test_longest_consecutive_empty(): assert longest_consecutive([]) == 0

# === Phase 2 ===
def test_palindrome(): assert is_palindrome("A man, a plan, a canal: Panama")
def test_not_palindrome(): assert not is_palindrome("race a car")
def test_longest_substring(): assert length_of_longest_substring("abcabcbb") == 3
def test_longest_substring_same(): assert length_of_longest_substring("bbbbb") == 1
def test_min_window(): assert min_window("ADOBECODEBANC", "ABC") == "BANC"
def test_min_window_none(): assert min_window("a", "aa") == ""

# === Phase 3 ===
def test_valid_parens(): assert is_valid("()[]{}") == True
def test_invalid_parens(): assert is_valid("(]") == False
def test_daily_temps(): assert daily_temperatures([73,74,75,71,69,72,76,73]) == [1,1,4,2,1,1,0,0]
def test_histogram(): assert largest_rectangle_area([2,1,5,6,2,3]) == 10

# === Phase 4 ===
def test_binary_search(): assert binary_search([-1,0,3,5,9,12], 9) == 4
def test_binary_search_miss(): assert binary_search([-1,0,3,5,9,12], 2) == -1
def test_rotated(): assert search_rotated([4,5,6,7,0,1,2], 0) == 4
def test_median_odd(): assert find_median_sorted_arrays([1, 3], [2]) == 2.0
def test_median_even(): assert find_median_sorted_arrays([1, 2], [3, 4]) == 2.5

# === Phase 5 ===
def test_reverse_list(): assert to_list(reverse_list(from_list([1,2,3,4,5]))) == [5,4,3,2,1]
def test_reverse_empty(): assert reverse_list(None) is None
def test_merge_k():
    lists = [from_list([1,4,5]), from_list([1,3,4]), from_list([2,6])]
    assert to_list(merge_k_lists(lists)) == [1,1,2,3,4,4,5,6]

# === Phase 6 ===
def test_max_depth():
    root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
    assert max_depth(root) == 3
def test_max_depth_null(): assert max_depth(None) == 0
def test_level_order():
    root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
    assert level_order(root) == [[3], [9, 20], [15, 7]]

# === Phase 7 ===
def test_climb_stairs(): assert climb_stairs(5) == 8
def test_lis(): assert length_of_lis([10,9,2,5,3,7,101,18]) == 4
def test_edit_distance(): assert min_distance("horse", "ros") == 3
def test_edit_same(): assert min_distance("abc", "abc") == 0

# === Phase 8 ===
def test_subsets(): assert len(subsets([1,2,3])) == 8
def test_word_search():
    board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]
    assert exist(board, "ABCCED") == True
def test_nqueens(): assert len(solve_n_queens(4)) == 2

# === Phase 9 ===
def test_islands():
    grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]
    assert num_islands(grid) == 3
def test_course_schedule(): assert can_finish(2, [[1,0]]) == True
def test_course_cycle(): assert can_finish(2, [[1,0],[0,1]]) == False
def test_word_ladder():
    assert ladder_length("hit", "cog", ["hot","dot","dog","lot","log","cog"]) == 5

# === Phase 10 ===
def test_kth_largest(): assert find_kth_largest([3,2,1,5,6,4], 2) == 5
def test_top_k(): assert sorted(top_k_frequent([1,1,1,2,2,3], 2)) == [1, 2]
def test_median_finder():
    m = MedianFinder()
    m.add_num(1); m.add_num(2)
    assert m.find_median() == 1.5
    m.add_num(3)
    assert m.find_median() == 2.0

# === Phase 11 ===
def test_jump_game(): assert can_jump([2,3,1,1,4]) == True
def test_jump_impossible(): assert can_jump([3,2,1,0,4]) == False
def test_task_scheduler(): assert least_interval(['A','A','A','B','B','B'], 2) == 8

# === Phase 12 ===
def test_merge_intervals(): assert merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
def test_erase_intervals(): assert erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]) == 1
def test_erase_none(): assert erase_overlap_intervals([[1,2],[2,3]]) == 0


from phase13_to_20 import (
    Trie, WordDictionary,
    count_components, find_redundant_connection,
    single_number, count_bits, reverse_bits,
    is_happy, my_pow,
    spiral_order, rotate,
    LRUCache, MinStack,
    max_sliding_window,
    longest_palindrome, encode, decode,
)

# === Phase 13: Trie ===
def test_trie():
    t = Trie()
    t.insert("apple")
    assert t.search("apple") == True
    assert t.search("app") == False
    assert t.starts_with("app") == True

def test_word_dict():
    wd = WordDictionary()
    wd.add_word("bad"); wd.add_word("dad"); wd.add_word("mad")
    assert wd.search(".ad") == True
    assert wd.search("b..") == True
    assert wd.search("..z") == False

# === Phase 14: Union Find ===
def test_components(): assert count_components(5, [[0,1],[1,2],[3,4]]) == 2
def test_components_single(): assert count_components(5, [[0,1],[1,2],[2,3],[3,4]]) == 1
def test_redundant(): assert find_redundant_connection([[1,2],[1,3],[2,3]]) == [2, 3]

# === Phase 15: Bit ===
def test_single_number(): assert single_number([4,1,2,1,2]) == 4
def test_count_bits(): assert count_bits(5) == [0,1,1,2,1,2]
def test_reverse_bits(): assert reverse_bits(0b00000010100101000001111010011100) == 0b00111001011110000010100101000000

# === Phase 16: Math ===
def test_happy_true(): assert is_happy(19) == True
def test_happy_false(): assert is_happy(2) == False
def test_pow(): assert my_pow(2.0, 10) == 1024.0
def test_pow_neg(): assert my_pow(2.0, -2) == 0.25

# === Phase 17: Matrix ===
def test_spiral(): assert spiral_order([[1,2,3],[4,5,6],[7,8,9]]) == [1,2,3,6,9,8,7,4,5]
def test_rotate():
    m = [[1,2,3],[4,5,6],[7,8,9]]
    rotate(m)
    assert m == [[7,4,1],[8,5,2],[9,6,3]]

# === Phase 18: Design ===
def test_lru():
    c = LRUCache(2)
    c.put(1, 1); c.put(2, 2)
    assert c.get(1) == 1
    c.put(3, 3)
    assert c.get(2) == -1

def test_min_stack():
    ms = MinStack()
    ms.push(-2); ms.push(0); ms.push(-3)
    assert ms.get_min() == -3
    ms.pop()
    assert ms.top() == 0
    assert ms.get_min() == -2

# === Phase 19: Monotonic Queue ===
def test_sliding_max(): assert max_sliding_window([1,3,-1,-3,5,3,6,7], 3) == [3,3,5,5,6,7]
def test_sliding_single(): assert max_sliding_window([1], 1) == [1]

# === Phase 20: String ===
def test_longest_palindrome(): assert longest_palindrome("babad") in ("bab", "aba")
def test_longest_palindrome_even(): assert longest_palindrome("cbbd") == "bb"
def test_encode_decode():
    original = ["hello", "world", "", "foo#bar"]
    assert decode(encode(original)) == original
